import * as path from 'path';
import { timeStampFormat } from 't-comm';
import { saveJsonToLog } from '../../helper';


export function savingUsingComponentMap(name, map) {
  const res = Object.keys(map).reduce((acc, item) => {
    // 之前是Set，转为数组才能保存
    acc[item] = [...map[item]];
    return acc;
  }, {});
  saveJsonToLog(res, name);
}

function strMapToObj(strMap) {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
    obj[k] = JSON.parse(v);
  }
  return obj;
}

/**
 * map转换为json
 */
export function mapToJson(map) {
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

export function flattenUsingComponentMap(map) {
  const res = {};
  function cursive(obj = {}, list: Array<string> = []) {
    Object.keys(obj).map((key) => {
      const value = map[key];
      if (value) {
        list.push(...Object.keys(value));

        cursive(value, list);
      }
    });
  }

  Object.keys(map).map((key) => {
    const temp: Array<string> = [];
    const value = map[key];

    if (value) {
      temp.push(...Object.keys(value));
    }
    cursive(value, temp);

    res[key] = temp;
  });

  saveJsonToLog(res, 'dispatch-vue.flatten-using-component-map.json');
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
export function handleComponentMap(map, pageSet) {
  const res = {};
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
export function genIterativeComponentMap(usingComponentsMap) {
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
export function formatComponentPath(comps = [], curPath) {
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
export function handleUsingComponents(usingComponents = {}) {
  return Object.keys(usingComponents).reduce((acc, item) => {
    const compPath = usingComponents[item].slice(1);
    acc[compPath] = {};
    return acc;
  }, {});
}


export function getNewPosName(component) {
  const list = component.split('/').filter(item => item !== '..');
  const folderName = list.slice(0, list.length - 1).join('-')
    .replaceAll('tip-match', 'tm')
    .replaceAll('local-component-module', 'lcm')
    .replaceAll('local-component-ui', 'lcu');
  return [folderName, list[list.length - 1]];
}


export function getMoveComponents({
  component,
  subPackage,
  outputDir,
}) {
  const [newPosName, fileName] = getNewPosName(component);
  const target = path.resolve(outputDir, subPackage, newPosName);

  const sourceRef = `/${component.replace('../../', '')}`;

  // const comp = path.resolve(outputDir, `./${sourceRef}`);

  const targetRef = path.join(target.replace(outputDir, ''), fileName)
    .split(path.sep)
    .join('/');

  // console.log(`[Dispatch Vue] 正在移动组件 ${getRelativePath(comp)} 到 ${getRelativePath(target)} 中`);

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
export function findSubPackages(pages, subPackageRoots) {
  const pkgs: Array<string> = [];
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < pages.length; i++) {
    const pagePath = pages[i];

    //  subPackageRoots，形如views/match, views/sche
    const pkgRoot = subPackageRoots.filter(root => pagePath.indexOf(root) === 0);
    if (!pkgRoot.length) { // 被非分包引用
      return [];
    }
    pkgs.push(...pkgRoot);
  }
  return pkgs;
}


export function getAllGlobalComps({
  globalComps,
  flattenUsingComponent,
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


export const findReplaceMap = (key, refMap = {}) => {
  const subPackage = Object.keys(refMap).find((item) => {
    const parsedItem = item.endsWith('/') ? item : `${item}/`;
    return key.startsWith(parsedItem);
  });

  if (subPackage) {
    return refMap[subPackage];
  }
};

export const formatTime = time => timeStampFormat(time, 'yyyy-MM-dd hh:mm:ss');


