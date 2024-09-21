import * as path from 'path';
import { updateAssetSource, saveJsonToLog } from 'plugin-light-shared';

const HANDLE_LIST = [
  'common/vendor.js',
  'common/runtime.js',
  'common/main.js',
];
let called = false;


export function replaceAbsolutePath({
  source,
  path,
  key,
}: {
  source: string;
  path: string;
  key: string;
}) {
  const reg = new RegExp(`(?<=__webpack_require__\\(")(${path}.*?)(?="\\))`);
  const newSource = source.replace(reg, key);
  return newSource;
}

export function findKey(obj: Record<string, any>) {
  const prodReg = /\w\["default"\]\s*=\s*\w\.exports/;
  const devReg = /__webpack_exports__\["default"\]\s*=\s*\(component\.exports\)/;

  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    const content = obj[key];
    if (prodReg.test(content) || devReg.test(content)) {
      return key;
    }
  }
  throw new Error('没找到对应的key，无法替换绝对路径');
}


function handlePluginSource(source = '', pluginName = '') {
  if (!pluginName) {
    return source;
  }

  const reg = new RegExp(`(../)((?:[\\w-]+/){1,})(${HANDLE_LIST.join('|')})`);

  let newSource = source;
  let match = reg.exec(newSource);
  while (match) {
    const { 0: origin, 1: pre, 3: innerFile } = match;
    const target = `${pre}${innerFile}`;
    newSource = newSource.replace(origin, target);
    match = reg.exec(newSource);
  }

  return newSource;
}


export function fixNpmPackage(assets: Record<string, any>, pluginName?: string) {
  if (called && process.env.NODE_ENV === 'production') {
    return;
  }
  called = true;

  const keys = Object.keys(assets);
  const handlesAssets: Array<{asset: string, hash: string}> = [];


  for (const item of keys) {
    if (item.indexOf('node-modules') > -1 && item.endsWith('.js')) {
      let source = assets[item].source?.()?.toString();

      source = handlePluginSource(source, pluginName);

      const cwd =  process.cwd()
        .split(path.sep)
        .join('/');

      if (source.indexOf(cwd) === -1 && !pluginName) continue;


      let jsonpKey = 'webpackJsonp';
      if (pluginName) {
        jsonpKey = `webpackJsonp_${pluginName}`;
      }

      global[jsonpKey as 'webpackJsonp'] = [];
      try {
        const toEvalSource = pluginName
          ? source.replace(/^.*(?=\(global)/, '')
          : source;
        // eslint-disable-next-line no-eval
        eval(toEvalSource);
      } catch (err) {
        console.warn('[FIX NPM PACKAGE] eval err', err);
      }

      const comps = global[jsonpKey as 'webpackJsonp']?.[0]?.[1];
      if (!comps && !pluginName) continue;

      const key = findKey(comps);
      if (!key && !pluginName) continue;

      const newSource = replaceAbsolutePath({
        source,
        path: cwd,
        key,
      });

      handlesAssets.push({
        asset: item,
        hash: key,
      });
      updateAssetSource(assets, item, newSource);
    }
  }

  saveJsonToLog(handlesAssets, 'fix-npm-package.result.json');
}
