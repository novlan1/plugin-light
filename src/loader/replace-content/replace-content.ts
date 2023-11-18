import { replaceAllPolyfill, isRegExp } from 't-comm';
import { getOptions } from 'loader-utils';

function isInTarget(files, current) {
  return files.filter((item) => {
    if (isRegExp(item)) {
      return item.test(current);
    }
    return item.indexOf(item) > -1;
  });
}

function replaceSource(source, replaceList, file) {
  let result = source;

  for (const item of replaceList) {
    const { from, to, files } = item;
    if (!isInTarget(files, file)) {
      continue;
    }

    if (isRegExp(from)) {
      result = result.replace(from, to);
    } else {
      result = result.replaceAll(from, to);
    }
  }
  return result;
}


export function replaceContent(this: any, source) {
  replaceAllPolyfill();
  const options = getOptions(this) || {};
  const { replaceList = [] } = options;

  if (!replaceList) {
    return source;
  }

  const result = replaceSource(source, replaceList, this.resourcePath);
  return result;
}

