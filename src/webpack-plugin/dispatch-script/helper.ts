import * as path from 'path';
import { normalizePath } from 't-comm';

import { getRelativePath, getUniCliCache } from '../../helper/index';
import type { IDispatchScriptOptions, IChunks, IModule } from './types';


const getPageSet = () => getUniCliCache('getPageSet')();

const INPUT_DIR = process.env.UNI_INPUT_DIR || '';
const SUB_PACKAGE_ROOTS = Object.keys((process as any).UNI_SUBPACKAGES || {});
const subPackageRootsWithSlash = Object.keys((process as any).UNI_SUBPACKAGES || {}).map(root => `${root}/`);

let mainPackagePages: Array<string>;

export const ROOT_NAME = 'MAIN';
export const VENDER_PATH = 'common/vendor';

/**
 * 获取主包页面，比如`src/project/user/views/index/index-home.vue`
 */
export function getMainPackagePages() {
  if (mainPackagePages) {
    return mainPackagePages;
  }

  const subPackages = SUB_PACKAGE_ROOTS
    .map(item => path.resolve(INPUT_DIR, item));
  const pages = (Array.from(getPageSet()) as Array<string>)
    .map(item => path.resolve(INPUT_DIR, item));

  mainPackagePages = pages
    .filter(page => !subPackages.find(subPackage => page.startsWith(subPackage)))
    .map(item => `${getRelativePath(item)}.vue`);

  return mainPackagePages;
}

/**
 * 获取main.js路径，比如`src/project/user/main.js`
 */
export function getMainJSPath() {
  return getRelativePath(path.resolve(INPUT_DIR, 'main.js'));
}

/**
 * 获取页面列表
 */
export function getPagesList() {
  const pages = Array.from(getPageSet()) as Array<string>;
  return pages.map(item => getRelativePath(path.resolve(INPUT_DIR, item)));
}


/**
 * path是否为页面路径
 * @example
 * src/project/user/views/match-data/rank.vue // true
 * src/local-logic/tip-match/homepage/homepage.js // false
 */
export function isPage(path: string) {
  const pages = getPagesList();
  const isPage = pages.find(item => path.startsWith(item));
  return !!isPage;
}


/**
 * 获取页面对应的分包
 */
export function getPageSubPackages(page: string) {
  const subPackageMap = SUB_PACKAGE_ROOTS
    .reduce((acc: Record<string, string>, item) => {
      acc[getRelativePath(path.resolve(INPUT_DIR, item))] = item;
      return acc;
    }, {});
  const subPackage = Object.keys(subPackageMap).find(item => page.startsWith(`${item}/`));

  if (subPackage) {
    return subPackageMap[subPackage];
  }
}


// 基础检测，vue和css类型不处理，只处理js类型
export function baseTest(module: IModule, options: IDispatchScriptOptions) {
  const mainPath = normalizePath(path.resolve(process.env.UNI_INPUT_DIR || '', 'main.'));

  if (module.type === 'css/mini-extract') {
    return false;
  }

  if (module.resource) {
    const resource = normalizePath(module.resource);
    if (
      resource.indexOf('.vue') !== -1
            || resource.indexOf('.nvue') !== -1
            || resource.indexOf(mainPath) === 0 // main.js
    ) {
      return false;
    }
    if (options?.whiteList?.length) {
      const isExist = options.whiteList.find(url => resource.includes(url));

      return !isExist;
    }
  }
  return true;
}


export const findSubPackages = function (chunks: IChunks) {
  return chunks.reduce((pkgs, item) => {
    const name = normalizePath(item.name);
    // 用chunk的名称匹配分包
    const pkgRoot = subPackageRootsWithSlash.find(root => name.indexOf(root) === 0);
    pkgRoot && pkgs.add(pkgRoot);
    return pkgs;
  }, new Set());
};


export const hasMainPackage = function (chunks: IChunks) {
  // 有一个chunk的名称，在所有分包中都匹配不到
  return chunks.find(item => !subPackageRootsWithSlash.find(root => item.name.indexOf(root) === 0));
};

export const findNameChunk = function (chunks: IChunks, name: string) {
  return chunks.find(chunk => chunk.name === name);
};
