import * as fs from 'fs';
import * as path from 'path';
import { analyzeComponent } from '@plugin-light/webpack-plugin-dispatch-vue';
import {
  getMainPackagePages,
  getMainJSPath,
  isPage,
  getPageSubPackages,
  ROOT_NAME,
} from './helper';
import { saveJsonToLog, getRelativePath } from '@plugin-light/shared';

const sourceDir = path.resolve(process.env.UNI_INPUT_DIR || '');
let scriptSubPackagesMap: Record<string, Array<string>>;

function getGlobalComponents() {
  const { globalCompsValues: globalComponents = [] } = analyzeComponent({ needGlobalComponents: true });
  const sourceDirList = sourceDir.split(path.sep);

  return (globalComponents as Array<any>)
    // 过滤掉 wxcomponents 中的组件，因为它们没有依赖额外的 js
    .filter(item => item.indexOf('wxcomponents/') <= -1 && item.indexOf('plugin:/') <= -1)
    .map((item) => {
      if (item.indexOf('../..') <= -1) return item;

      const temp = item.replace('../../', '').replace(/node-modules/g, 'node_modules');

      for (let i = sourceDirList.length;i >= 0;i--) {
        const file = path.resolve(sourceDirList.slice(0, i).join('/'), `${temp}.vue`);
        if (fs.existsSync(file)) {
          return path.join(sourceDirList.slice(0, i).join('/'), `${temp}.vue`);
        }
      }
    })
    .map(item => getRelativePath(item));
}


function isUsedInMainPackage(list: Array<string>) {
  const globalComponents = getGlobalComponents();
  const mainPackagePages = getMainPackagePages();
  const mainJSPath = getMainJSPath();

  saveJsonToLog(mainPackagePages, 'dispatch-script.inner-main-package-pages.json');

  return list.find(item => [
    ROOT_NAME,
    mainJSPath,
    ...mainPackagePages,
    ...globalComponents,
  ].indexOf(item) > -1);
}

function getSubPackagesFromFiles(list: Array<string>): Array<string> {
  let subPackages = list
    .filter(item => isPage(item))
    .map(item => getPageSubPackages(item))
    .filter(item => item) as Array<string>;
  subPackages = Array.from(new Set(subPackages));
  return subPackages;
}

// 寻找 JS 对应的分包列表
export function getScriptSubPackageMap(obj: Record<string, any>) {
  const keys = Object.keys(obj);
  // const res: Array<{js: Array<string>, subPackages: Array<string>}> = [];
  const parsedRes: Record<string, Array<string>> = {};
  const jsReg = /(.js|.ts)$/;


  for (const key of keys) {
    if (getPageSubPackages(key) || !jsReg.test(key)) {
      continue;
    }
    const list = obj[key];
    // const temp: Array<string> = [];

    if (isUsedInMainPackage(list)) {
      continue;
    }

    // temp.push(key);
    // temp.push(...list.filter((item: string) => jsReg.test(item) && !isPage(item)));

    const subPackages = getSubPackagesFromFiles(list);

    // res.push({
    //   js: temp,
    //   subPackages,
    // });
    parsedRes[key] = subPackages;
  }

  // saveJsonToLog(res, 'dispatch-script.inner-deps-to-dispatch.json');
  saveJsonToLog(parsedRes, 'dispatch-script.inner-deps-to-dispatch-deep.json');
  return parsedRes;
}


/**
 * 获取一个 js/ts 文件对应的分包
 * @example
 * getScriptSubPackages('/Users/mike/Documents/web/src/project/user/mixins/tim-mixin.js', depsMap)
 * // [ 'views/sche/' ]
 */
export function getScriptSubPackages(moduleName: string, depsMap: Record<string, Array<string>>) {
  if (!moduleName) return [];
  if (!scriptSubPackagesMap) {
    scriptSubPackagesMap = getScriptSubPackageMap(depsMap);
  }
  return scriptSubPackagesMap[getRelativePath(moduleName)] || [];
}
