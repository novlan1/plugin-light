/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  formatComponentPath,
  genIterativeComponentMap,
  handleComponentMap,
  flattenUsingComponentMap,
  mapToJson,
  savingUsingComponentMap,
  handleUsingComponents,
  getMoveComponents,
  findSubPackages,
} from './helper';

const fs = require('fs');
const {
  getPageSet,
  getJsonFileMap,
} = require('@dcloudio/uni-cli-shared/lib/cache');


let MOVE_COMPONENT_MIN_DISABLE_LIST: Array<string> = [];
let MOVE_COMPONENT_MIN_USE_TIMES = 100;

const outputDir = process.env.UNI_OUTPUT_DIR;
const usingComponentsMap = {};


export function analyzeComponent(options: {
  moveComponents?: {
    minUseTimes: number
    disableList: Array<string>
  }
} = {}): {
    parsedReplaceRefList?: Array<any>
    movingComponents?: Array<any>
  } {
  console.log('process.env.UNI_OPT_SUBPACKAGES: ', process.env.UNI_OPT_SUBPACKAGES);
  if (!process.env.UNI_OPT_SUBPACKAGES) {
    return {};
  }

  if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
  }

  MOVE_COMPONENT_MIN_USE_TIMES = options?.moveComponents?.minUseTimes || MOVE_COMPONENT_MIN_USE_TIMES;
  MOVE_COMPONENT_MIN_DISABLE_LIST = options?.moveComponents?.disableList || [];


  /**
    * // jsonFileMap 示例
    * {
    *   "app": "{\n  \"pages\": [\n    \"views/index/index-home\"\n  ],\n  \"subPackages\": [\n    {\n      \"root\": \"packages\",\n      \"pages\": [\n        \"views/webview/webview\"\n      ]\n    },\n    {\n      \"root\": \"views/dy-channel-match\",\n      \"pages\": [\n        \"index\"\n      ]\n    },\n    {\n      \"root\": \"views/qq-channel-match\",\n      \"pages\": [\n        \"index\"\n      ]\n    },\n    {\n      \"root\": \"views/environment-tips\",\n      \"pages\": [\n        \"index\"\n      ]\n    },\n    {\n      \"root\": \"views/sche\",\n      \"pages\": [\n        \"sche\",\n        \"cycle-set\",\n        \"cup-set\",\n        \"select-promotion-team\",\n        \"sche-set\"\n      ]\n    },\n    {\n      \"root\": \"views/match\",\n      \"pages\": [\n        \"match-detail-index\",\n        \"match-team-web-invite\",\n        \"match-rule-detail\",\n        \"match-data/index\",\n        \"tip-match-game-record\",\n        \"match-team-mp-invite\",\n        \"reward-cfg\",\n        \"image-crop\",\n        \"poster-mp-invite\",\n        \"poster-simple-mp-invite\",\n        \"match-ob-room\",\n        \"match-manager\",\n        \"match-manager-apply\",\n        \"match-manager-apply-list\",\n        \"schedule-list\"\n      ]\n    },\n    {\n      \"root\": \"views/room\",\n      \"pages\": [\n        \"room\",\n        \"test-join-room\",\n        \"ai-room\",\n        \"video-room\",\n        \"room-quick\"\n      ]\n    },\n    {\n      \"root\": \"views/battle\",\n      \"pages\": [\n        \"battle-detail\",\n        \"battle-detail-undetermined\"\n      ]\n    },\n    {\n      \"root\": \"views/create\",\n      \"pages\": [\n        \"create-preview\",\n        \"create\",\n        \"create-rule\",\n        \"create-custom-group-type\",\n        \"create-complete\"\n      ]\n    },\n    {\n      \"root\": \"views/history\",\n      \"pages\": [\n        \"index-history\"\n      ]\n    },\n    {\n      \"root\": \"views/edit\",\n      \"pages\": [\n        \"edit-rule\",\n        \"match-edit\",\n        \"match-edit-reward\",\n        \"edit-custom-group-type\"\n      ]\n    },\n    {\n      \"root\": \"views/team\",\n      \"pages\": [\n        \"team-list/index\",\n        \"team-zone/index\",\n        \"team-member/index\"\n      ]\n    },\n    {\n      \"root\": \"views/match-detail\",\n      \"pages\": [\n        \"match-detail\",\n        \"publish-news\"\n      ]\n    },\n    {\n      \"root\": \"views/phone\",\n      \"pages\": [\n        \"bind-phone\"\n      ]\n    },\n    {\n      \"root\": \"views/homepage\",\n      \"pages\": [\n        \"account-manage\",\n        \"protocol\",\n        \"homepage\"\n      ]\n    },\n    {\n      \"root\": \"views/setting\",\n      \"pages\": [\n        \"match-setting\"\n      ]\n    },\n    {\n      \"root\": \"views/owner\",\n      \"pages\": [\n        \"owner-introduce\",\n        \"owner-apply\",\n        \"owner-share\",\n        \"owner-save\",\n        \"owner-mp-save\"\n      ]\n    }\n  ],\n  \"window\": {\n    \"initialRenderingCache\": \"static\",\n    \"pageOrientation\": \"portrait\",\n    \"navigationBarTextStyle\": \"black\",\n    \"navigationBarBackgroundColor\": \"#FFFFFF\",\n    \"backgroundColor\": \"#FFFFFF\",\n    \"backgroundColorTop\": \"#F4F5F6\",\n    \"backgroundColorBottom\": \"#F4F5F6\",\n    \"navigationStyle\": \"custom\"\n  },\n  \"preloadRule\": {\n    \"views/index/index-home\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"views/match-detail\",\n        \"views/create\",\n        \"views/homepage\",\n        \"views/history\"\n      ]\n    },\n    \"views/match-detail/match-detail\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"views/room\",\n        \"views/setting\",\n        \"views/team\"\n      ]\n    },\n    \"views/homepage/account-manage\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"views/phone\",\n        \"views/match\"\n      ]\n    },\n    \"views/create/create\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"views/phone\"\n      ]\n    },\n    \"views/sche/sche\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"views/edit\",\n        \"views/room\"\n      ]\n    },\n    \"views/room/room\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"views/battle\"\n      ]\n    },\n    \"views/battle/battle-detail\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"views/match\"\n      ]\n    },\n    \"views/match/match-detail-index\": {\n      \"network\": \"all\",\n      \"packages\": [\n        \"__APP__\"\n      ]\n    }\n  },\n  \"embeddedAppIdList\": [\n    \"wx4a0a73ec028e47d7\",\n    \"wx8abaf00ee8c3202e\"\n  ],\n  \"permission\": {\n    \"scope.userLocation\": {\n      \"desc\": \"演示定位能力\"\n    }\n  },\n  \"lazyCodeLoading\": \"requiredComponents\",\n  \"plugins\": {\n    \"liveAccountPlugin\": {\n      \"version\": \"1.0.11\",\n      \"provider\": \"wxd756fc4323d8d8ae\"\n    }\n  },\n  \"customUsingComponents\": {\n    \"van-toast\": \"/wxcomponents/vant/toast/index\",\n    \"van-loading\": \"/wxcomponents/vant/loading/index\",\n    \"van-checkbox\": \"/wxcomponents/vant/checkbox/index\",\n    \"van-tab\": \"/wxcomponents/vant/tab/index\",\n    \"van-tabs\": \"/wxcomponents/vant/tabs/index\",\n    \"van-info\": \"/wxcomponents/vant/info/index\",\n    \"van-sticky\": \"/wxcomponents/vant/sticky/index\",\n    \"van-datetime-picker\": \"/wxcomponents/vant/datetime-picker/index\",\n    \"live-info-comp\": \"plugin://liveAccountPlugin/hello-component\"\n  },\n  \"usingComponents\": {\n    \"match-comm-dialog\": \"/../../local-component/ui/tip-match/tip-match-tip-popup/index\",\n    \"match-comm-share-tips\": \"/../../local-component/ui/tip-match/tip-match-share-prompt/index\",\n    \"match-header-mp\": \"/../../local-component/ui/tip-match/tip-match-header-mp/index\"\n  },\n  \"usingAutoImportComponents\": {}\n}",
    *   "views/index/index-home": "{\n  \"navigationBarTitleText\": \"\",\n  \"customUsingComponents\": {},\n  \"usingAutoImportComponents\": {},\n  \"usingComponents\": {\n    \"u-i-home\": \"/../../local-component/ui/pages/user/home/index\",\n    \"protocol-dialog\": \"/../../local-component/module/tip-match/tip-match-protocol-dialog/index\",\n    \"official-account-dialog\": \"/../../local-component/ui/tip-match/tip-match-qr-code-popup/index\"\n  }\n}",
    *   "packages/views/webview/webview": "{\n  \"customUsingComponents\": {},\n  \"usingComponents\": {},\n  \"usingAutoImportComponents\": {}\n}",
    *   "views/qq-channel-match/index": "{\n  \"customUsingComponents\": {},\n  \"usingAutoImportComponents\": {},\n  \"usingComponents\": {\n    \"ui-q-q-channel-match\": \"/../../local-component/ui/pages/admin/qq-current-match/index\"\n  }\n}",
    *   "views/environment-tips/index": "{\n  \"customUsingComponents\": {},\n  \"usingComponents\": {\n    \"ui-tips\": \"/../../local-component/ui/tip-match/tip-match-login-error-tip/index\"\n  },\n  \"usingAutoImportComponents\": {}\n}",
    *   "../../local-component/ui/tip-match/tip-match-rank-award/index": "{\n  \"usingAutoImportComponents\": {},\n  \"genericComponents\": [\n    \"index-tip-draggable-default\"\n  ],\n  \"component\": true,\n  \"usingComponents\": {\n    \"tip-draggable\": \"/../../local-component/ui/tip-match/draggable/draggable-mp\",\n    \"match-header\": \"/../../local-component/ui/tip-match/tip-match-header/index\",\n    \"match-header-mp\": \"/../../local-component/ui/tip-match/tip-match-header-mp/index\"\n  }\n}",
    * }
    */
  const jsonFileMap = getJsonFileMap();
  fs.writeFileSync('./log/jsonFileMap.json', mapToJson(jsonFileMap));

  /**
   * // pageSet
   * [
   *   "views/index/index-home",
   *   "packages/views/webview/webview",
   *   "views/match/match-detail-index",
   *   "views/match/match-team-web-invite",
   * ]
   */
  const pageSet = getPageSet();
  fs.writeFileSync('./log/pageSet.json', JSON.stringify(Array.from(pageSet), null, 2));

  /**
   * process.env.UNI_OPT_SUBPACKAGES => true
   */
  fs.writeFileSync('./log/SUBPACKAGES.json', JSON.stringify(process.env.UNI_OPT_SUBPACKAGES));


  // 处理genericComponents
  for (const name of jsonFileMap.keys()) {
    const jsonObj = JSON.parse(jsonFileMap.get(name));
    let { usingComponents = {} } = jsonObj;
    const { genericComponents = [] } = jsonObj;

    const parsedGeneric = formatComponentPath(genericComponents, name) || {};
    usingComponents = {
      ...parsedGeneric,
      ...usingComponents,
    };

    usingComponentsMap[name] = handleUsingComponents(usingComponents);
    if (!usingComponents || !pageSet.has(name)) {
      continue;
    }
  }

  genIterativeComponentMap(usingComponentsMap);

  let allUsingComponentMap = {};
  try {
    const flattenUsingComponent = flattenUsingComponentMap(usingComponentsMap);
    allUsingComponentMap = handleComponentMap(flattenUsingComponent, pageSet);

    fs.writeFileSync('./log/usingComponentsMap.json', JSON.stringify(usingComponentsMap, null, 2));
    savingUsingComponentMap('./log/allUsingComponentMap.json', allUsingComponentMap);
  } catch (err) {
    console.log('err', err);
  }


  /**
   * // process.UNI_SUBPACKAGES
   *
   * {
   *   "packages": {
   *     "root": "packages"
   *   },
   *   "views/environment-tips": {
   *     "root": "views/environment-tips"
   *   },
   *   "views/sche": {
   *     "root": "views/sche"
   *   },
   * }
   */
  const subPackageRoots = Object.keys((process as any).UNI_SUBPACKAGES);
  fs.writeFileSync('./log/UNI_SUBPACKAGES.json', JSON.stringify((process as any).UNI_SUBPACKAGES, null, 2));


  const replaceRefList: Array<Array<string>> = [];

  const movingComponents: Array<{
    compJs: string
    compJson: string
    compWxml: string
    compWxss: string
    target: string
    newPosName: string
    sourceRef: string
    targetRef: string
    subPackage: string
    subPackages: Array<string>
  }> = [];

  Object.keys(allUsingComponentMap).forEach((componentName) => {
    const subPackages = findSubPackages([...allUsingComponentMap[componentName]], subPackageRoots);
    const pkgRoot = subPackageRoots.find(root => componentName.indexOf(root) === 0);

    if (!pkgRoot && subPackages.length && subPackages.length <= MOVE_COMPONENT_MIN_USE_TIMES) {
      subPackages.forEach((subPackage) => {
        const disable = !!MOVE_COMPONENT_MIN_DISABLE_LIST.find(item => componentName.includes(item));
        if (disable) {
          console.log('disable.componentName', componentName);
        }
        if (subPackage && componentName.indexOf(subPackage) !== 0 && !disable) { // 仅存在一个子包引用且未在该子包
          const {
            sourceRef,
            targetRef,
            compJs,
            compJson,
            compWxml,
            compWxss,
            target,
            newPosName,
          } = getMoveComponents({
            component: componentName,
            subPackage,
            outputDir,
          });

          replaceRefList.push([sourceRef, targetRef, subPackage]);

          movingComponents.push({
            compJs,
            compJson,
            compWxml,
            compWxss,
            target,
            newPosName,
            sourceRef,
            targetRef,
            subPackage,
            subPackages,
          });
        }
      });
    }
  });

  const parsedReplaceRefList = Array.from(new Set(replaceRefList.map(item => JSON.stringify(item))))
    .map(item => JSON.parse(item));

  /**
   *
   * // parsedReplaceRefList 示例
   *
   * [
   *   [
   *     "/local-component/ui/pages/user/dy-current-match/index",
   *     "/views/dy-channel-match/lcu-pages-user-dy-current-match/index",
   *     "views/dy-channel-match"
   *   ],
   *   [
   *     "/local-component/ui/tip-match/tip-match-empty/index",
   *     "/views/dy-channel-match/lcu-tm-tm-empty/index",
   *     "views/dy-channel-match"
   *   ],
   * ]
   */
  fs.writeFileSync('./log/parsedReplaceRefList.json', JSON.stringify(parsedReplaceRefList, null, 2));

  const parsedMovingComponents = Array.from(new Set(movingComponents.map(item => JSON.stringify(item))))
    .map(item => JSON.parse(item));

  /**
   *
   * // movingComponents 示例如下，目前实际用到的只有 sourceRef、targetRef
   *
   * [
   *   {
   *     compJs: '/Users/mike/Documents/web/dist/build/mp-weixin/local-component/ui/tip-match/tip-match-notice/index-mp.js',
   *     compJson: '/Users/mike/Documents/web/dist/build/mp-weixin/local-component/ui/tip-match/tip-match-notice/index-mp.json',
   *     compWxml: '/Users/mike/Documents/web/dist/build/mp-weixin/local-component/ui/tip-match/tip-match-notice/index-mp.wxml',
   *     compWxss: '/Users/mike/Documents/web/dist/build/mp-weixin/local-component/ui/tip-match/tip-match-notice/index-mp.wxss',
   *     target: '/Users/mike/Documents/web/dist/build/mp-weixin/views/match/lcu-tm-tm-notice',
   *     newPosName: 'lcu-tm-tm-notice',
   *     sourceRef: '/local-component/ui/tip-match/tip-match-notice/index-mp',
   *     targetRef: '/views/match/lcu-tm-tm-notice/index-mp',
   *     subPackage: 'views/match',
   *     subPackages: [
   *       'views/match',
   *       'views/create',
   *     ],
   *   },
   * ];
   */
  fs.writeFileSync('./log/movingComponents.json', JSON.stringify(parsedMovingComponents, null, 2));

  return {
    parsedReplaceRefList,
    movingComponents,
  };
}


