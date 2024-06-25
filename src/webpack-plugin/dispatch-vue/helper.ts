import * as path from 'path';
import { timeStampFormat } from 't-comm';
import { saveJsonToLog, removeFirstSlash, getUniCliCache } from '../../helper';
import type { IRefMap, IReplaceRefList } from './types';


export function savingUsingComponentMap(name: string, map: Record<string, any>) {
  const res = Object.keys(map).reduce((acc: Record<string, any>, item) => {
    // 之前是Set，转为数组才能保存
    acc[item] = [...map[item]];
    return acc;
  }, {});
  saveJsonToLog(res, name, true);
}

function strMapToObj(strMap: Array<any>) {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
    obj[k] = JSON.parse(v);
  }
  return obj;
}

/**
 * map转换为json
 */
export function mapToJson(map: any) {
  return strMapToObj(map);
}


/**
 * 拉平组件关系
 *
 * @example
 *  // 示例如下：
 *
 * {
 *   "app": [
 *     "../../local-component/ui/tip-match/tip-match-tip-popup/index",
 *   ],
 *   "views/index/index-home": [
 *     "../../local-component/ui/pages/user/home/index",
 *   ],
 *   "../../components/ua-nes-tim/components/uni-badge": [],
 *   "../../components/ua-nes-tim/components/sned-target-selector": [
 *     "../../components/ua-nes-tim/components/uni-data-select",
 *     "../../components/ua-nes-tim/components/uni-icons/uni-icons"
 *   ],
 * }
 */

export function flattenUsingComponentMap(rawMap: Record<string, any>) {
  const res: Record<string, Array<string>> = {};

  function cursive(componentsMap = {}, components: Array<string> = [], fathers: Array<string>) {
    const keys = Object.keys(componentsMap);
    for (const key of keys) {
      if (fathers.includes(key)) {
        // 防止递归调用，即防止子孙和祖先相同
        continue;
      }

      const subComponentsMap = rawMap[key];

      if (subComponentsMap) {
        const innerKeys = Object.keys(subComponentsMap);

        innerKeys.forEach((innerKey) => {
          if (!fathers.includes(innerKey)) {
            // 防止递归调用
            components.push(innerKey);
          }
        });

        cursive(subComponentsMap, components, [...fathers, key]);
      }
    }
  }

  Object.keys(rawMap).map((key) => {
    const components: Array<string> = [];
    const componentsMap = rawMap[key];

    if (componentsMap) {
      components.push(...Object.keys(componentsMap));
    }
    cursive(componentsMap, components, [key]);

    res[key] = components;
  });

  return res;
}


/**
 * 获取使用一个组件的所有分包，返回 allUsingComponentMap
 * @example
 *
 * // allUsingComponentMap 示例
 *
 * {
 *   "../../local-component/ui/pages/user/home/index": [
 *     "views/index/index-home"
 *   ],
 *   "../../local-component/module/tip-match/tip-match-protocol-dialog/index": [
 *     "views/index/index-home",
 *     "views/match/match-detail-index",
 *     "views/room/room-quick",
 *     "views/create/create"
 *   ],
 *   "../../local-component/ui/tip-match/tip-match-qr-code-popup/index": [
 *     "views/index/index-home",
 *     "views/sche/sche",
 *     "views/match/match-detail-index",
 *     "views/room/room",
 *     "views/room/ai-room",
 *     "views/room/video-room",
 *     "views/team/team-zone/index",
 *     "views/match-detail/match-detail",
 *     "views/setting/match-setting"
 *   ],
 *   "views/team/team-list/sub/tip-match-team-list": [
 *     "views/team/team-list/index"
 * ],
 * }
 */
export function handleComponentMap(map: Record<string, Array<string>>, pageSet: Set<string>) {
  const res: Record<string, Set<string>> = {};

  for (const name of Object.keys(map)) {
    if (!pageSet.has(name)) {
      continue;
    }
    const value = map[name] || [];
    for (const key of value) {
      if (!res[key]) {
        res[key] = new Set();
      }
      res[key].add(name);
    }
  }
  return res;
}


/**
 * 处理 usingComponentsMap 迭代关系
 * @example
 *
 * // usingComponentsMap 示例
 * {
 *   "app": {
 *     "../../local-component/ui/tip-match/tip-match-header-mp/index": {
 *       "../../local-component/ui/tip-match/tip-match-global-notice/index": {},
 *       "../../local-component/ui/tip-match/tip-match-global-msg/index": {},
 *       "../../local-component/ui/tip-match/tip-match-popver/index": {}
 *     }
 *   },
 *   "views/index/index-home": {
 *     "../../local-component/ui/pages/user/home/index": {
 *       "../../local-component/ui/tip-match/tip-match-loading-mode/index": {},
 *       "../../local-component/ui/tip-match/tip-match-item/index": {},
 *       "../../local-component/ui/pages/user/guide/index": {},
 *       "../../local-component/ui/tip-match/tip-match-popver/index": {},
 *       "../../component/ui/tip-merchant/tip-comp-scroll-view/index": {
 *         "../../component/ui/tip-merchant/tip-comp-scroll-view/scroll-view-mp": {}
 *       },
 *     },
 *     "../../local-component/ui/tip-match/tip-match-qr-code-popup/index": {
 *       "../../component/ui/widget/qrcode/index": {
 *         "../../component/ui/widget/qrcode/qrcode-mp": {}
 *       }
 *     }
 *   },
 *   "packages/views/webview/webview": {},
 * }
 */
export function genIterativeComponentMap(usingComponentsMap: Record<string, any>) {
  Object.keys(usingComponentsMap).map((page) => {
    const compObj = usingComponentsMap[page];
    Object.keys(compObj).map((comp) => {
      if (usingComponentsMap[comp]) {
        compObj[comp] = usingComponentsMap[comp];
      }
    });
  });
}


/**
 * 格式化组件路径
 * genericComponents数组中存储的是一个key，找到其对应的真正的组件路径
 * @param comps 组件列表
 * @param curPath 当前路径
 * @returns 处理后对象
 * @example
 *
 * formatComponentPath(
 *   ['index-tip-draggable-default'],
 *   '../../local-component/ui/tip-match/tip-match-rank-award/index'
 * )
 *
 * // 结果如下：
 *
 * {
 *   'index-tip-draggable-default':
 *      '../../local-component/ui/tip-match/tip-match-rank-award/index-tip-draggable-default'
 * }
 *
 */
export function formatComponentPath(comps: Array<string> = [], curPath: string) {
  return comps.reduce((acc: {
    [key: string]: string
  }, item) => {
    let key: string = item;
    if (!key.startsWith('/')) {
      const list = curPath.split('/');

      key = `/${list.slice(0, list.length - 1).join('/')}/${key}`;
    }

    acc[item] = key;
    return acc;
  }, {});
}

/**
 * 处理 usingComponents，路径去掉前面的`/`
 *
 * 即`/../../components/xx`转为`../../components/xx`。
 *
 * @param usingComponents 使用组件对象
 */
export function handleUsingComponents(usingComponents: Record<string, any> = {}) {
  return Object.keys(usingComponents).reduce((acc: Record<string, any>, item) => {
    const compPath = usingComponents[item].slice(1);
    acc[compPath] = {};
    return acc;
  }, {});
}


export function getNewPosName(component: string) {
  const list = component.split('/').filter(item => item !== '..');
  const folderName = list.slice(0, list.length - 1).join('-')
    .replaceAll('tip-match', 'tm')
    .replaceAll('local-component-module', 'lcm')
    .replaceAll('local-component-ui', 'lcu');
  return [folderName, list[list.length - 1]];
}


export function genMoveComponents({
  component,
  subPackage,
  outputDir,
}: {
  component: string;
  subPackage: string;
  outputDir: string;
}) {
  const [newPosName, fileName] = getNewPosName(component);
  const target = path.resolve(outputDir, subPackage, newPosName);

  const sourceRef = `/${component.replace('../../', '')}`;

  const targetRef = path.join(target.replace(outputDir, ''), fileName)
    .split(path.sep)
    .join('/');


  return {
    sourceRef,
    targetRef,
  };
}


/**
 * 找到pages对应的分包
 * @param pages 使用某一个组件的页面列表
 * @param subPackageRoots 分包列表
 * @returns 使用某一个组件的分包列表
 */
export function findSubPackages(pages: Array<string>, subPackageRoots: Array<string>) {
  const pkgs: Array<string> = [];
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < pages.length; i++) {
    const pagePath = pages[i];

    //  subPackageRoots，形如views/match, views/sche
    const pkgRoot = subPackageRoots.filter(root => pagePath.indexOf(`${root}/`) === 0);
    if (!pkgRoot.length) { // 被非分包引用
      return [];
    }
    pkgs.push(...pkgRoot);
  }

  return Array.from(new Set(pkgs));
}

/**
 * 获取所有全局组件，包括已声明的全局组件的子组件
 * @param {object} param 参数对象
 * @param {object} param.globalComps 声明的全局组件
 * @param {object} param.flattenUsingComponent 拉平的组件列表
 * @returns 全局组件列表
 */
export function getAllGlobalComps({
  globalComps,
  flattenUsingComponent,
}: {
  globalComps: Record<string, string>;
  flattenUsingComponent: Record<string, Array<string>>;
}) {
  const globalCompsValues: Array<string> = Object.values(globalComps);

  const childGlobalComps = globalCompsValues.reduce((acc, item) => {
    if (flattenUsingComponent[item]) {
      flattenUsingComponent[item].map((child) => {
        acc.add(child);
      });
    }

    if (item.startsWith('/')) {
      const newItem = item.slice(1);
      if (flattenUsingComponent[newItem]) {
        flattenUsingComponent[newItem].map((child) => {
          acc.add(child);
        });
      }
    }
    return acc;
  }, new Set());

  globalCompsValues.push(...Array.from(childGlobalComps as Set<string>));

  const globalCompSet = globalCompsValues.map((item) => {
    if (item.startsWith('/')) {
      return item.slice(1);
    }
    return item;
  });

  const parsedGlobalCompsValues = Array.from(new Set(globalCompSet));

  return parsedGlobalCompsValues;
}


export const findReplaceMap = (key: string, refMap: IRefMap = {}) => {
  const subPackage = Object.keys(refMap).find((item) => {
    const parsedItem = item.endsWith('/') ? item : `${item}/`;
    return key.startsWith(parsedItem);
  });

  if (subPackage) {
    return refMap[subPackage];
  }
};

export const formatTime = (time: number) => timeStampFormat(time, 'yyyy-MM-dd hh:mm:ss');


export function replaceAllPolyfill() {
  String.prototype.replaceAll = function (s1: string, s2) {
    const newStr = s1.replace(/([+*?[\](){}^$|])/g, '\\$1');

    return this.replace(new RegExp(newStr, 'gm'), s2 as string);
  };
}


export function formatReplaceRefList(replaceRefList: IReplaceRefList) {
  const refMap = replaceRefList.reduce((acc: Record<string, IReplaceRefList>, item) => {
    const { 0: origin, 1: target, 2: subPackage } = item;
    const list = [removeFirstSlash(origin), removeFirstSlash(target)];

    if (acc[subPackage]) {
      acc[subPackage].push(list);
    } else {
      acc[subPackage] = [list];
    }
    return acc;
  }, {});
  return refMap;
}

export const getPageSet = () => getUniCliCache('getPageSet')();
