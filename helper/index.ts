/* eslint-disable @typescript-eslint/no-require-imports */
import * as fs from 'fs';
import * as path from 'path';
import { isWindows } from 't-comm';

export const ROOT_NAME = 'MAIN';

export function saveJsonToLog(content, file, needLog = true) {
  if (!needLog) return;
  createLogDir();
  fs.writeFile(`./log/${file}`, JSON.stringify(content, null, 2), {
    encoding: 'utf-8',
  }, () => {

  });
}

export function createLogDir() {
  if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
  }
}

export const normalizePath = path => (isWindows() ? path.replace(/\\/g, '/') : path);

export function updateAssetSource(assets, key, source) {
  assets[key] = {
    source() {
      return source;
    },
    size() {
      return source.length;
    },
  };
}

export function removeFirstSlash(key) {
  if (key.startsWith('/')) {
    return key.slice(1);
  }
  return key;
}

function sortStringList(list) {
  list.sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
  return list;
}

export function parseSetDeps(deps) {
  return Object.keys(deps).reduce((acc, item) => {
    acc[item]  = Array.from(deps[item]);

    sortStringList(acc[item]);
    return acc;
  }, {});
}


export function getRelativePath(filePath) {
  return path.relative(process.cwd(), path.resolve(filePath));
}

export function getUniCliCache(key?: string) {
  const cache = require('@dcloudio/uni-cli-shared/lib/cache');
  if (!key) return cache;
  return cache[key];
}
