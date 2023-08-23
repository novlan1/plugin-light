import * as fs from 'fs';
import * as path from 'path';
import { analyzeComponent } from '../dispatch-vue/analyze-component';
import {
  getMainPackagePages,
  getMainJSPath,
  isPage,
  getPageSubPackages,
  ROOT_NAME,
} from './helper';
import { saveJsonToLog, getRelativePath } from '../../helper/index';

const sourceDir = path.resolve(process.env.UNI_INPUT_DIR || '');
let scriptSubPackagesMap;

function getGlobalComponents() {
  const { globalCompsValues: globalComponents = [] } = analyzeComponent({ needGlobalComponents: true });
  const sourceDirList = sourceDir.split(path.sep);

  return (globalComponents as Array<any>)
    // 过滤掉wxcomponents中的组件，因为它们没有依赖额外的js
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


function isUsedInMainPackage(list) {
  const globalComponents = getGlobalComponents();
  const mainPackagePages = getMainPackagePages();
  const mainJSPath = getMainJSPath();

  return list.find(item => [
    ROOT_NAME,
    mainJSPath,
    ...mainPackagePages,
    ...globalComponents,
  ].indexOf(item) > -1);
}

function getSubPackagesFromFiles(list) {
  let subPackages = list
    .filter(item => isPage(item))
    .map(item => getPageSubPackages(item))
    .filter(item => item);
  subPackages = Array.from(new Set(subPackages));
  return subPackages;
}

// 寻找JS对应的分包列表
export function getScriptSubPackageMap(obj) {
  const keys = Object.keys(obj);
  const res: Array<{js: Array<string>, subPackages: Array<string>}> = [];
  const parsedRes = {};
  const jsReg = /(.js|.ts)$/;


  for (const key of keys) {
    if (getPageSubPackages(key) || !jsReg.test(key)) {
      continue;
    }
    const list = obj[key];
    const temp: Array<string> = [];

    if (isUsedInMainPackage(list)) {
      continue;
    }

    temp.push(key);
    temp.push(...list.filter(item => jsReg.test(item) && !isPage(item)));

    const subPackages = getSubPackagesFromFiles(list);

    res.push({
      js: temp,
      subPackages,
    });
    parsedRes[key] = subPackages;
  }

  saveJsonToLog(res, 'dispatch-script.deps-to-dispatch.json');
  saveJsonToLog(parsedRes, 'dispatch-script.deps-to-dispatch-deep.json');
  return parsedRes;
}


/**
 * 获取一个js/ts文件对应的分包
 * @example
 * getScriptSubPackages('/Users/mike/Documents/web/src/project/user/mixins/tim-mixin.js', depsMap)
 * // [ 'views/sche/' ]
 */
export function getScriptSubPackages(moduleName, depsMap) {
  if (!moduleName) return [];
  if (!scriptSubPackagesMap) {
    scriptSubPackagesMap = getScriptSubPackageMap(depsMap);
  }
  return scriptSubPackagesMap[getRelativePath(moduleName)] || [];
}
