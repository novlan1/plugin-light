import path from 'path';

const LOADER_PROD = 'loader.prod.js';

export function getLoaderFile(dir = '', isProd = false) {
  if (isProd) {
    return path.resolve(dir, LOADER_PROD);
  }
  return path.resolve(dir, 'loader.js');
}


export function getLoaderProdFile(dir = '') {
  return path.resolve(dir, LOADER_PROD);
}

