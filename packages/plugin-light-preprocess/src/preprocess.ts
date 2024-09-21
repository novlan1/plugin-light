import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import delim from './regexrules';
import * as XRegExp from 'xregexp';


export function preprocessFile(
  srcFile: string,
  destFile: string,
  context: Record<string, any>,
  callback: any,
  options: Record<string, any>,
) {
  options = getOptionsForFile(srcFile, options);
  context.src = srcFile;

  fs.readFile(srcFile, (err, data) => {
    if (err) return callback(err, data);
    const parsed = preprocess(data, context, options);
    fs.writeFile(destFile, parsed, callback);
  });
}

export function preprocessFileSync(
  srcFile: string,
  destFile: string,
  context: Record<string, any>,
  options: Record<string, any>,
) {
  options = getOptionsForFile(srcFile, options);
  context.src = srcFile;

  const data = fs.readFileSync(srcFile);
  const parsed = preprocess(data, context, options);
  return fs.writeFileSync(destFile, parsed);
}

function getOptionsForFile(srcFile: string, options: Record<string, any>) {
  options = options || {};
  options.srcDir = options.srcDir || path.dirname(srcFile);
  options.type = options.type || getExtension(srcFile);

  return options;
}

function getExtension(filename: string) {
  const ext = path.extname(filename || '').split('.');
  return ext[ext.length - 1];
}

export function preprocess(src: string | Buffer, context: Record<string, any>, typeOrOptions: Record<string, any>) {
  src = src.toString();
  context = context || process.env;

  // default values
  const options = {
    fileNotFoundSilentFail: false,
    srcDir: process.cwd(),
    srcEol: getEolType(src),
    type: delim.html,
  };

  // needed for backward compatibility with 2.x.x series
  if (typeof typeOrOptions === 'string') {
    typeOrOptions = {
      type: typeOrOptions,
    };
  }

  // needed for backward compatibility with 2.x.x series
  if (typeof context.srcDir === 'string') {
    typeOrOptions = typeOrOptions || {};
    typeOrOptions.srcDir = context.srcDir;
  }

  if (typeOrOptions && typeof typeOrOptions === 'object') {
    options.srcDir = typeOrOptions.srcDir || options.srcDir;
    options.fileNotFoundSilentFail = typeOrOptions.fileNotFoundSilentFail || options.fileNotFoundSilentFail;
    options.srcEol = typeOrOptions.srcEol || options.srcEol;
    options.type = delim[typeOrOptions.type] || options.type;
  }

  context = copy(context);

  return preprocessor(src, context, options);
}

function preprocessor(src: string, context: Record<string, any>, opts: Record<string, any>, noRestoreEol = false) {
  src = normalizeEol(src);

  let rv = src;

  rv = replace(rv, opts.type.include, processIncludeDirective.bind(null, false, context, opts));

  if (opts.type.extend) {
    rv = replaceRecursive(rv, opts.type.extend, (
      startMatches: Array<string>,
      endMatches: Array<string>,
      include: string,
      recurse: Function,
    ) => {
      const file = (startMatches[1] || '').trim();
      const extendedContext: any = copy(context);
      const extendedOpts: any = copy(opts);
      extendedContext.src = path.join(opts.srcDir, file);
      extendedOpts.srcDir = path.dirname(extendedContext.src);

      const fileContents = getFileContents(extendedContext.src, opts.fileNotFoundSilentFail, context.src);
      if (fileContents.error) {
        return fileContents.contents;
      }

      const extendedSource = preprocessor(fileContents.contents, extendedContext, extendedOpts, true).trim();

      if (extendedSource) {
        include = include.replace(/^\n?|\n?$/g, '');
        return replace(extendedSource, opts.type.extendable, recurse(include));
      }
      return '';
    });
  }

  if (opts.type.foreach) {
    rv = replaceRecursive(rv, opts.type.foreach, (
      startMatches: Array<string>,
      endMatches: Array<string>,
      include: string,
      recurse: Function,
    ) => {
      const variable = (startMatches[1] || '').trim();
      const forParams = variable.split(' ');
      if (forParams.length === 3) {
        const contextVar = forParams[2];
        const arrString = getDeepPropFromObj(context, contextVar);
        let eachArr: any;
        if (arrString.match(/\{(.*)\}/)) {
          eachArr = JSON.parse(arrString);
        } else if (arrString.match(/\[(.*)\]/)) {
          eachArr = arrString.slice(1, -1);
          eachArr = eachArr.split(',');
          eachArr = eachArr.map((arrEntry: string) => arrEntry.replace(/\s*(['"])(.*)\1\s*/, '$2'));
        } else {
          eachArr = arrString.split(',');
        }

        const replaceToken = new RegExp(XRegExp.escape(forParams[0]), 'g');
        const recursedInclude = recurse(include);

        return Object.keys(eachArr).reduce((stringBuilder, arrKey) => {
          const arrEntry = eachArr[arrKey];
          return stringBuilder + recursedInclude.replace(replaceToken, arrEntry);
        }, '');
      }
      return '';
    });
  }

  if (opts.type.exclude) {
    rv = replaceRecursive(rv, opts.type.exclude, (
      startMatches: Array<string>,
      endMatches: Array<string>,
      include: string,
      recurse: Function,
    ) => {
      const test = (startMatches[1] || '').trim();
      return testPasses(test, context) ? '' : recurse(include);
    });
  }

  if (opts.type.if) {
    rv = replaceRecursive(rv, opts.type.if, (
      startMatches: Record<string | number, any>,
      endMatches: Record<string | number, any>,
      include: string,
      recurse: Function,
    ) => {
      const variant = startMatches[1];
      const test = (startMatches[2] || '').trim();
      switch (variant) {
        case 'if':
        case 'ifdef':
          return testPasses(test, context)
            ? (padContent(startMatches.input) + recurse(include) + padContent(endMatches.input))
            : padContent(startMatches.input + include + endMatches.input);
        case 'ifndef':
          return !testPasses(test, context)
            ? (padContent(startMatches.input) + recurse(include) + padContent(endMatches.input))
            : padContent(startMatches.input + include + endMatches.input);
          //      case 'ifdef':
          //        return typeof getDeepPropFromObj(context, test) !== 'undefined'
          // ? (padContent(startMatches.input) + recurse(include) + padContent(endMatches.input))
          // : padContent(startMatches.input + include + endMatches.input) // fixed by xxxxxx
          //      case 'ifndef':
          //        return typeof getDeepPropFromObj(context, test) === 'undefined'
          // ? (padContent(startMatches.input) + recurse(include) + padContent(endMatches.input))
          // : padContent(startMatches.input + include + endMatches.input) // fixed by xxxxxx
        default:
          throw new Error(`Unknown if variant ${variant}.`);
      }
    });
  }

  rv = replace(rv, opts.type.echo, (match: any, variable: string) => {
    variable = (variable || '').trim();
    // if we are surrounded by quotes, echo as a string
    const stringMatch = variable.match(/^(['"])(.*)\1$/);
    if (stringMatch) return stringMatch[2];

    return getDeepPropFromObj(context, (variable || '').trim());
  });

  rv = replace(rv, opts.type.exec, (match: string, name: string, value: string) => {
    name = (name || '').trim();
    value = value || '';

    let params = value.split(',');
    const stringRegex = /^['"](.*)['"]$/;

    params = params.map((param) => {
      param = param.trim();
      if (stringRegex.test(param)) { // handle string parameter
        return param.replace(stringRegex, '$1');
      }  // handle variable parameter
      return getDeepPropFromObj(context, param);
    });

    const fn = getDeepPropFromObj(context, name);
    if (!fn || typeof fn !== 'function') return '';

    return fn.apply(context, params);
  });

  rv = replace(rv, opts.type['include-static'], processIncludeDirective.bind(null, true, context, opts));

  if (!noRestoreEol) {
    rv = restoreEol(rv, opts.srcEol);
  }

  return rv;
}
const splitRE = /\r?\n/g;

function padContent(content: string) {
  return Array(content.split(splitRE).length).join('\n');
}

function getEolType(source: string) {
  let eol;
  let foundEolTypeCnt = 0;

  if (source.indexOf('\r\n') >= 0) {
    eol = '\r\n';
    foundEolTypeCnt += 1;
  }
  if (/\r[^\n]/.test(source)) {
    eol = '\r';
    foundEolTypeCnt += 1;
  }
  if (/[^\r]\n/.test(source)) {
    eol = '\n';
    foundEolTypeCnt += 1;
  }

  if (eol == null || foundEolTypeCnt > 1) {
    eol = os.EOL;
  }

  return eol;
}

function normalizeEol(source: string, indent = '') {
  // only process any kind of EOL if indentation has to be added, otherwise replace only non \n EOLs
  if (indent) {
    source = source.replace(/(?:\r?\n)|\r/g, `\n${indent}`);
  } else {
    source = source.replace(/(?:\r\n)|\r/g, '\n');
  }

  return source;
}

function restoreEol(normalizedSource: string, originalEol: string) {
  if (originalEol !== '\n') {
    normalizedSource = normalizedSource.replace(/\n/g, originalEol);
  }

  return normalizedSource;
}

function replace(rv: string, rule: any, processor: any) {
  const isRegex = typeof rule === 'string' || rule instanceof RegExp;
  const isArray = Array.isArray(rule);

  if (isRegex) {
    rule = [new RegExp(rule, 'gmi')];
  } else if (isArray) {
    rule = rule.map((subRule: string) => new RegExp(subRule, 'gmi'));
  } else {
    throw new Error('Rule must be a String, a RegExp, or an Array.');
  }

  return rule.reduce((rv: string, rule: RegExp) => rv.replace(rule, processor), rv);
}

function replaceRecursive(rv: string, rule: any, processor: (...args: Array<any>) => string) {
  if (!rule.start || !rule.end) {
    throw new Error('Recursive rule must have start and end.');
  }

  const startRegex = new RegExp(rule.start, 'mi');
  const endRegex = new RegExp(rule.end, 'mi');

  function matchReplacePass(content: string) {
    const matches = XRegExp.matchRecursive(content, rule.start, rule.end, 'gmi', {
      valueNames: ['between', 'left', 'match', 'right'],
    });

    const matchGroup: Record<string, any> = {
      left: null,
      match: null,
      right: null,
    };

    return matches.reduce((builder: string, match: {
      name: string;
      value: string;
    }) => {
      switch (match.name) {
        case 'between':
          builder += match.value;
          break;
        case 'left':
          matchGroup.left = startRegex.exec(match.value);
          break;
        case 'match':
          matchGroup.match = match.value;
          break;
        case 'right':
          matchGroup.right = endRegex.exec(match.value);
          builder += processor(matchGroup.left, matchGroup.right, matchGroup.match, matchReplacePass);
          break;
      }
      return builder;
    }, '');
  }

  return matchReplacePass(rv);
}

function processIncludeDirective(
  isStatic: boolean,
  context: Record<string, any>,
  opts: Record<string, any>,
  match: any,
  linePrefix = '',
  file: string,
) {
  file = (file || '').trim();
  const indent = linePrefix.replace(/\S/g, ' ');
  const includedContext: any = copy(context);
  const includedOpts: any = copy(opts);
  includedContext.src = path.join(opts.srcDir, file);
  includedOpts.srcDir = path.dirname(includedContext.src);

  const fileContents = getFileContents(includedContext.src, opts.fileNotFoundSilentFail, context.src);
  if (fileContents.error) {
    return linePrefix + fileContents.contents;
  }

  let includedSource = fileContents.contents;
  if (isStatic) {
    includedSource = fileContents.contents;
  } else {
    includedSource = preprocessor(fileContents.contents, includedContext, includedOpts, true);
  }

  includedSource = normalizeEol(includedSource, indent);

  if (includedSource) {
    return linePrefix + includedSource;
  }
  return linePrefix;
}

function getTestTemplate(test: string) {
  /* jshint evil:true */
  test = test || 'true';
  test = test.trim();

  // force single equals replacement
  test = test.replace(/([^=!])=([^=])/g, '$1==$2');
  // fixed by xxxxxx
  test = test.replace(/-/g, '_');
  /* eslint-disable no-new-func */
  return new Function('context', `with (context||{}){ return ( ${test} ); }`);
}

function testPasses(test: string, context: Record<string, any>) {
  const testFn = getTestTemplate(test);
  try {
    return testFn(context, getDeepPropFromObj);
  } catch (e) {}
  return false;
}

function getFileContents(path: string, failSilent: boolean, requesterPath: string) {
  try {
    fs.statSync(path);
  } catch (e) {
    if (failSilent) {
      return {
        error: true,
        contents: `${path} not found!`,
      };
    }
    let errMsg = path;
    errMsg = requesterPath ? `${errMsg} requested from ${requesterPath}` : errMsg;
    errMsg += ' not found!';
    throw new Error(errMsg);
  }
  return {
    error: false,
    contents: fs.readFileSync(path).toString(),
  };
}

function copy(obj: Record<string, any>) {
  return Object.keys(obj).reduce((copyObj: Record<string, any>, objKey) => {
    copyObj[objKey] = obj[objKey];
    return copyObj;
  }, {});
}

function getDeepPropFromObj(obj: Record<string, any>, propPath: any) {
  propPath.replace(/\[([^\]+?])\]/g, '.$1');
  propPath = propPath.split('.');

  // fast path, no need to loop if structurePath contains only a single segment
  if (propPath.length === 1) {
    return obj[propPath[0]];
  }

  // loop only as long as possible (no exceptions for null/undefined property access)
  propPath.some((pathSegment: string) => {
    obj = obj[pathSegment];
    return (obj == null);
  });

  return obj;
}
