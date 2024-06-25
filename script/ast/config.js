const REPLACE_CONFIG = [
  {
    source: [
      'src/common',
      'src/common/network',
      'src/common/network/post',
      'src/common/network-v2',
      'src/common/network/index',
      'src/common/network-v2/index',
    ],
    importedList: [
      'post',
    ],
    target: '@tencent/pmd-network',
  },
  {
    source: [
      'src/common',
      'src/common/network',
    ],
    importedList: [
      'commPost',
    ],
    target: 'src/component/logic/deprecated/request/comm-post',
  },
  {
    source: 'src/common/uniapp/router/router-interceptor',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'routerInterCeptor',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/uniapp-router/router-interceptor-simple',
  },
  {
    source: 'src/common/uniapp/globalVars',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: '$window',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/globalVar/index',
  },
  {
    source: 'src/common/uniapp/mixins/projectMixins',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'moreUniAppMixins',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/more-uni-app',
  },
  {
    source: 'src/common/vue/app-base/helper/global-app-data',
    importedList: [
      'initGlobalAppData',
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/global-app-data/index',
  },
  {
    source: 'src/common/vue/app-base/helper/init-xss',
    importedList: [
      'initXss',
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/init-xss',
  },
  {
    source: 'src/common/vue/app-base/helper/init-plugin',
    importedList: [
      'initPlugin',
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/init-plugin/v2',
  },
  {
    source: 'src/common/vue/app-base/helper/init-mixin',
    importedList: [
      'initMixin',
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/init-mixin',
  },
  {
    source: 'src/common/uniapp/router/router-mp',
    importedList: [
      'initMixin',
    ],
    target: '@tencent/pmd-vue/uniapp-router/router-define',
  },
  {
    source: 'src/common/vue/app-base/helper/init-reporttk',
    importedList: [
      'initReportTK',
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/init-reporttk/index',
  },
  {
    source: 'src/common/vue/app-base/helper/init-network',
    importedList: [
      'initNetwork',
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/init-network',
  },
  {
    source: 'src/common/tools/refresh',
    importedList: [
      'refreshVersion',
    ],
    target: 'src/component/logic/tip-merchant/refresh-version',
  },
  {
    source: 'src/common/network/axios',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'axios',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/axios',
  },
  {
    source: [
      'src/common/config/goods',
      'src/common/config/goods.ts',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'GoodsConfigInfo',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-config/lib/goods',
  },
  {
    source: [
      'src/common/tools/qq-back-util/index',
      'src/common/tools/qq-back-util',
    ],
    importedList: [
      'QQBackUtils',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'QQBackUtils',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/qq-back-util',
  },
  {
    source: [
      'src/common/tools/qq-refresh-info/index',
      'src/common/tools/qq-refresh-info',
    ],
    importedList: [
      'QQRefreshInfo',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'QQRefreshInfo',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/qq-refresh-info',
  },
  {
    source: 'src/common/config',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'ConfigInfo',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-config/lib/project',
  },
  {
    source: [
      'src/common/vue/directive/loadmore/betterLoadMore',
      'src/common/vue/directive/loadmore/betterLoadMore.ts',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'betterLoadMorePlugin',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/plugin/better-load-more',
  },
  {
    source: 'src/common/vue/directive/loadmore/hloadmore',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'hLoadMoreDirective',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/directive/loadmore/hloadmore',
  },
  {
    source: 'src/common/vue/directive/clickoutside',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'clickOutsideDirective',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/directive/click-outside',
  },
  {
    source: 'src/common/vue/mixin/option/iframeMixins',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'iframeMixins',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/iframe',
  },
  {
    source: 'src/common/vue/mixin/option/settingMixins',
    importedList: [
      'settingMixins',
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/setting',
  },
  {
    source: 'src/common/vue/mixin/global/lifecycleMixins',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'lifecycleMixins',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/uniapp-mixin/lifecycleMixins',
  },
  {
    source: 'src/common/vue/mixin/option/whiteListMixins',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'whiteListMixins',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/white-list',
  },
  {
    source: 'src/common/vue/mixin/option/screenLockMixins',
    importedList: [
      'screenLockMixins',
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/screen-lock',
  },
  {
    source: [
      'src/common/vue/mixin/option/locationMixins',
      'src/common/vue/mixin/option/locationMixins.ts',
      'src/common/vue/mixin/option',
    ],
    importedList: [
      'locationMixins',
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/location',
  },
  {
    source: 'src/common/vue/mixin/option/jsAdapterMixins',
    importedList: [
      'jsAdapterMixins',
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/js-adapter',
  },
  {
    source: 'src/common/vue/mixin/option/tlogReportMixins',
    importedList: [
      'tlogReportMixins',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'tlogReportMixins',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/mixin/tlog-report',
  },
  {
    source: 'src/common/uniapp/router/routes',
    importedList: [
      'ALL_ROUTES',
    ],
    target: '@tencent/pmd-vue/lib/uniapp-router/routes-origin',
  },
  {
    source: [
      'src/common/location/location',
      'src/common/location',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'Location',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-location',
  },
  {
    source: [
      'src/common/location/location-interface',
      'src/common/location/location-interface.ts',
    ],
    importedList: [
      'LocationFlag',
      'LocationDefaultOption',
    ],
    target: '@tencent/pmd-location',
  },
  {
    source: 'src/common/location/location-default-options',
    importedList: [
      'LocationDefaultOptions',
    ],
    target: '@tencent/pmd-location',
  },
  {
    source: 'src/common/network-v2/sample/smoba/index',
    importedList: [
      ['initNetworkManager', 'initNetworkManagerSmoba'],
    ],
    target: '@tencent/pmd-network',
  },
  {
    source: [
      '@tencent/pmd-network',
    ],
    importedList: [
      'initNetworkManagerDefault',
      'initNetworkManagerHokclub',
      'initNetworkManagerIgame',
      'initNetworkManagerOa',
      'initNetworkManagerSlol',
      'initNetworkManagerSmoba',
      'initNetworkManagerSmobaPro',
      'initNetworkManagerIegsp',
    ],
    target: '@tencent/pmd-vue/lib/network',
  },
  {
    source: 'src/common/network-v2/sample/smoba-pro/index',
    importedList: [
      ['initNetworkManager', 'initNetworkManagerSmobaPro'],
    ],
    target: '@tencent/pmd-network',
  },
  {
    source: 'src/common/network-v2/sample/igame/index',
    importedList: [
      ['initNetworkManager', 'initNetworkManagerIgame'],
    ],
    target: '@tencent/pmd-network',
  },
  {
    source: 'src/common/tools/adtag',
    importedList: [
      'getAdTag',
      'getUserTag',
    ],
    target: '@tencent/pmd-tools/lib/adtag',
  },
  {
    source: 'src/common/types/mixin.type',
    importedList: [
      'MixinType',
    ],
    target: '@tencent/pmd-types/mixin',
  },
  {
    source: 'src/common/pag',
    importedList: [
      'PAGWeb',
    ],
    target: '@tencent/pmd-tools/lib/pag',
  },
  {
    source: 'src/common/report',
    importedList: [
      'getReportTK',
    ],
    target: '@tencent/pmd-report',
  },
  {
    source: 'src/common/report/helper',
    importedList: [
      'getTraceId',
      'getReportTK',
      'setReportTK',
      'getTcssId',
    ],
    target: '@tencent/pmd-report',
  },
  {
    source: 'src/common/report/tcss',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'tcssReport',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-report',
  },
  {
    source: 'src/common/report/data-center',
    importedList: [
      'reportBrandExposure',
      'reportMerchantExposure',
      'reportTaskExposure',
      'reportAwardExposure',
      'createTReportDataBrandExposure',
      'createTReportDataMerchantExposure',
      'createTReportDataTaskExposure',
      'createTReportDataAwardExposure',
      'createTReportDataAdExposure',

      'reportUserStatics',
      'reportCommData',
      'reportPageExposure',
      'reportClick',
    ],
    target: '@tencent/pmd-report',
  },
  {
    source: 'src/common/report/data-center/merchant-report',
    importedList: [
      'reportBrandExposure',
      'reportMerchantExposure',
      'reportTaskExposure',
      'reportAwardExposure',
      'createTReportDataBrandExposure',
      'createTReportDataMerchantExposure',
      'createTReportDataTaskExposure',
      'createTReportDataAwardExposure',
      'createTReportDataAdExposure',
    ],
    target: '@tencent/pmd-report',
  },
  {
    source: 'src/common/report/data-center/mp-exposure',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'MpExposure',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-report',
  },
  {
    source: 'src/common/tools/interval',
    importedList: [
      'interval',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'interval',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/interval',
  },
  {
    source: [
      'src/common',
      'src/common/tools/time',
      'src/common/tools/time/time',
    ],
    importedList: [
      'getLastTimestamp',
      'dateFormat',
      'timeStampFormat',
      'parseTime',

      'getTodayZero',
      'getZeroTimestamp',

      'getTimeAgo',
      'getTimeAgoOrDate',

      'countDownTimeStr',
      'countDownMinuteStr',
      'recentOneWeekDates',
      'getCountDownObj',
      'getCountDownStr',
      'getMonthDays',
      'getMonthDay',
      'isSameWeek',
      'setVisibleTimeout',
      'GlobalInterval',
    ],
    target: '@tencent/pmd-tools/lib/time',
  },
  {
    source: [
      'src/common',
      'src/common/tools/time',
      'src/common/tools/time/countdown',
    ],
    importedList: [
      'getCountDownObj',
      'getCountDownStr',
    ],
    target: '@tencent/pmd-tools/lib/time',
  },
  {
    source: 'src/common/tools/game',
    importedList: [
      'GAME_GP',
      'GAME_HLDDZ',
      'GAME_MAJIANG',
      'GAME_PVP',
      'GAME_LOLM',
      'GAME_SJJQ',
      'GAME_CF',
      'GAME_LIFE',
      'GAME_TXGD',
      'GAME_PENG',

      'GAME_NBA',
      'GAME_LMJX',
      'GAME_X5M',
      'GAME_CFM',
      'GAME_TLBB',
      'GAME_YMZX',

      'GAME_LOL',
      'GAME_JCC',

      'GAME_CF_HD',
      'GAME_TY',
      'GAME_SHANHAI',
      'GAME_SEED',
      'GAME_VAL',
      'GAME_LOSTARK',


      'getGameLogo',
      'getGame',
      'getName',
      'getTag',
      'isIGameGame',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/game',
  },
  {
    source: 'src/common/tools/image',
    importedList: [
      'tinyImage',
      'getCdnUrl',
      'handleImgUnit',
      'getHttpsUrl',
      'getCompressImgUrl',
    ],
    target: '@tencent/pmd-tools/lib/image',
  },
  {
    source: 'src/common/tools/clipboard',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'Clipboard',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/clipboard',
  },
  {
    source: 'src/common/tools/captcha',
    importedList: [
      'initCaptcha',
      'CAPTCHA_CLOUD_SDK_URL',
      'CAPTCHA_APPIDS',
    ],
    target: '@tencent/pmd-tools/lib/captcha',
  },
  {
    source: 'src/common/tools/parse-function',
    importedList: [
      'parseFunction',
    ],
    target: '@tencent/pmd-tools/lib/parse-function',
  },
  {
    source: [
      'src/common',
      'src/common/tools/env',
    ],
    importedList: [
      'isTestEnv',
      'checkNodeEnv',
      'getEnvCurrPage',
      'getEnvLoginType',
      'getLoginInfo',
      'compareVersion',
      'checkIs3rdAppByUrl',
      'getEnvVersion',
      'initEnv',
      'isTestEnv',
      'isSupportUniMp',

      'getUserAgent',
      'checkUAIsIOS',
      'getEnvUAType',
    ],
    target: '@tencent/pmd-tools/lib/env',
  },
  {
    source: [
      'src/common',
      'src/common/tools/env',
      'src/common/tools/env/env',
    ],
    importedList: [
      'checkNodeEnv',
      'getEnvCurrPage',
      'getEnvLoginType',
      'getLoginInfo',
      'compareVersion',
      'checkIs3rdAppByUrl',
      'getEnvVersion',
      'initEnv',
      'isTestEnv',
    ],
    target: '@tencent/pmd-tools/lib/env',
  },
  {
    source: 'src/common/tools/pvpapp',
    importedList: [
      'invoke',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/pvpapp',
  },
  {
    source: [
      'src/common/tools/share',
      'src/common/tools',
      'src/common',
    ],
    importedList: [
      // 'Share',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
      'initShare',
      'hideShareBtn',
      'openShareUI',
      'setupWzydShare',
    ],
    target: '@tencent/pmd-widget/lib/share',
  },
  {
    source: [
      'src/common',
    ],
    importedList: [
      {
        sourceType: 'ImportSpecifier',
        sourceName: 'Share',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/share',
  },
  {
    source: [
      'src/common/tools/url',
      'src/common/tools',
    ],
    importedList: [
      'getUrlPara',
      'composeUrlQuery',
      'msdkSuffix',
      'getQueryObj',
      'param2Obj',
      'realJumpToWeb',
      'getPvpPartition',
      'getExtPlatParams',
      'resolveUrlParams',
      'formatUrlParams',
      'extendUrlParams',
      'removeUrlParams',
      'keepUrlParams',
      'filterUrlParams',

      'decode',
      'stringifyParams',
      'addUrlParam',
      'addUrlParams',
    ],
    target: '@tencent/pmd-tools/lib/url',
  },
  {
    source: 'src/common/tools/url/url',
    importedList: [
      'getUrlPara',
      'getQueryObj',
      'composeUrlQuery',
      'param2Obj',
      'realJumpToWeb',
      'addUrlParam',
    ],
    target: '@tencent/pmd-tools/lib/url',
  },
  {
    source: 'src/common/widget/toast',
    importedList: [
      'Toast',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'Toast',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/toast',
  },
  {
    source: 'src/common/tools/css-loader',
    importedList: [
      'loadCss',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/css-loader',
  },
  {
    source: [
      'src/common/tools/little-loader',
      'src/common/tools',
    ],
    importedList: [
      'loader',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'loader',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/little-loader',
  },
  {
    source: [
      'src/common/storage/cookie',
    ],
    importedList: [
      'cookie',
      'clearAll',
      'writeAllCookie',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'cookie',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/storage',
  },
  {
    source: [
      'src/common/storage/cookie/igame-cookie',
    ],
    importedList: [
      'cookie',
      'clearAll',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'cookie',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/storage',
  },
  {
    source: 'src/common/tools/store-promise',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'storePromise',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/store-promise',
  },
  {
    source: 'src/common/tools/area',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'getAreaData',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/area',
  },
  {
    source: 'src/common/tools/city',
    importedList: [
      'getCityName',
      'getProvName',
      'getAreaName',
      'getAreaCode',
      'getAreaData',
      'getAreaDataAll',
      'rawCity',
    ],
    target: '@tencent/pmd-tools/lib/city',
  },
  {
    source: 'src/common/tools/copy',
    importedList: [
      'copyText',
    ],
    target: '@tencent/pmd-tools/lib/copy',
  },
  {
    source: [
      'src/common/report/aegis',
      'src/common/report/aegis/report',
      'src/common/report/aegis/report/index',
    ],
    importedList: [
      'initReportAegis',
      'reportAegisEvent',
      'watchHiddenAndReport',
      'reportEnterGame',
    ],
    target: '@tencent/pmd-aegis',
  },
  {
    source: 'src/common/login/login-mp-weixin',
    importedList: [
      ['login', 'loginMpWeixin'],
      'weixinLogin', 'qqLogin', 'launchQQLogin',
    ],
    target: '@tencent/pmd-login',
  },
  {
    source: 'src/common/login',
    importedList: [
      'handleLogin',
      'getLoginData',
      'logout',
      'checkLogin',
      'getLoginUrlList',
      'showMobileLoginDialog',
      'showWXPCLoginDialog',
      'showPCLoginDialog',
      'LoginMpType',
      'loginMp',
    ],
    target: '@tencent/pmd-login',
  },
  {
    source: 'src/common/tools/dom2image',
    importedList: [
      'conver', 'url2Base64', 'convertImageToCanvas',
      {
        sourceType: 'ImportSpecifier',
        sourceName: 'dom2image',
        targetType: 'ImportNamespaceSpecifier',
      },
      {
        sourceType: 'ImportDefaultSpecifier',
        sourceName: 'dom2image',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/dom2image',
  },
  {
    source: [
      'src/common/tools/validate',
      'src/common',
    ],
    importedList: [
      'isMobile',
      'isQQNumber',
      'isExternal',
      'validUsername',
      'validURL',
      'validLowerCase',
      'validUpperCase',
      'validAlphabets',
      'validEmail',
      'isString',
      'isArray',
      'isEmail',
      'isTel',
      'isIdCard',
      'isNumber',
      'isNumberOrUndefined',
      'isNotEmptyString',
      'hasValue',
      'delEmptyValues',
      'getType',
    ],
    target: '@tencent/pmd-tools/lib/validate',
  },
  {
    source: 'src/common/tools/adapter',
    importedList: [
      'callJsSetFullScreen',
      'callJsShowBrowserUI',
      'callJsFontSizeAdapter',
      'callJsBrowserAdapter',
      'callJsSoftKeyboard',
      'callJsNetWorkType',
    ],
    target: '@tencent/pmd-tools/lib/adapter',
  },
  {
    source: 'src/common/tools/animation',
    importedList: [
      'runParabolaAnimation',
    ],
    target: '@tencent/pmd-tools/lib/animation',
  },
  {
    source: [
      'src/common/tools/dialog-displayer',
      'src/common/tools',
      'src/common',
    ],
    importedList: [
      'showComponentDialog',
      'showDialogQueue',
    ],
    target: '@tencent/pmd-tools/lib/dialog-displayer',
  },
  {
    source: [
      'src/common/vue/store/login/index',
      'src/common/vue/store/login',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/store/login/index',
  },
  {
    source: [
      'src/common/vue/app-base/helper',
    ],
    importedList: [
      'initXss',
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/init-xss',
  },
  {
    source: [
      'src/common/vue/store/user-info/index',
      'src/common/vue/store/user-info',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/store/user-info/index',
  },
  {
    source: 'src/common/network/request/axios-manager',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: 'src/component/logic/deprecated/request/axios-manager',
  },
  {
    source: 'src/common/network/comm',
    importedList: [
      'post',
      'gotoLogin',
    ],
    target: 'src/component/logic/deprecated/request/comm',

  },
  {
    source: [
      'src/common/vue/mixin/global/ebus',
    ],
    importedList: [
      'ebusV2',
    ],
    target: '@tencent/pmd-vue/lib/vue/ebus/v2',
  },
  {
    source: [
      'src/common/vue/mixin/projectBaseMixins.ts',
      'src/common/vue/mixin/projectBaseMixins',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'rawMixinObj',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/helper/init-mixin/raw-mixin-obj',
  },
  {
    source: [
      'src/common/tools/debug',
      '@tencent/pmd-tools/lib/debug',
    ],
    importedList: [
      'checkIsDevList',
      'getUserWhiteListInfo',
      'checkIsWhiteList',
      'consoleLog',
      'canFakeLogin',
      'loadVConsole',
    ],
    target: '@tencent/pmd-vue/lib/logic/debug',
  },
  {
    source: [
      'src/common/tools/debug/config',
      '@tencent/pmd-tools/lib/debug/config',
    ],
    importedList: [
      'DEBUG_CGI_ENV',
    ],
    target: '@tencent/pmd-vue/lib/logic/debug/config',
  },
  {
    source: 'src/common/tools/open-embedded-mini-program',
    importedList: [
      'openEmbeddedMiniProgram',
    ],
    target: '@tencent/pmd-tools/lib/open-embedded-mini-program',
  },
  {
    source: 'src/common/tools/phone',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/phone',
  },
  {
    source: [
      'src/common/tools/minijump',
      '@tencent/pmd-tools/lib/minijump',
    ],
    importedList: [
      'JUMP_TYPES',
      'getJumpMiniProgramAppid',
      'getJumpMiniProgramUserName',
      'getJumpMiniProgramPath',
      'GP_GAME_MP_APP_ID',
      'GP_GAME_MP_QQ_APP_ID',

      'handleGetMiniProgramOpenLink',
      'postGetMiniProgramOpenLink',

      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
      {
        sourceType: 'ImportNamespaceSpecifier',
        targetType: 'ImportNamespaceSpecifier',

      },
    ],
    target: '@tencent/pmd-vue/lib/logic/minijump',
  },
  {
    source: 'src/common/tools/jump',
    importedList: [
      'jumpToWeb',
      'realJumpToWeb',
      'jumpToIGameMatch',
      'jumpToMiniGame',
    ],
    target: '@tencent/pmd-tools/lib/jump',
  },
  {
    source: '@tencent/pmd-tools/lib/time-on-page',
    importedList: [
      'TimeOnPage',
    ],
    target: '@tencent/pmd-vue/lib/logic/time-on-page',
  },
  {
    source: [
      'src/common',
      'src/common/tools/user-info',
    ],
    importedList: [
      'UserInfo',
      {
        sourceName: 'UserInfo',
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'UserInfo',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/user-info',
  },
  {
    source: 'src/common/tools/weixin',
    importedList: [
      'wxOpenLaunchWeapp',
      'configWx',
      'postGetWeixinConfig',
      'wxOpenSubscribe',
      'loaderWxApi',
    ],
    target: '@tencent/pmd-tools/lib/weixin',
  },
  {
    source: [
      'src/common/tools/uni-utils',
      '@tencent/pmd-tools/lib/uni-utils',
    ],
    importedList: [
      'getAccountInfoSync',
      'getAppid',
      'updateManager',
      'getSystemInfoSync',
      'getEnterOptionsSync',
    ],
    target: '@tencent/pmd-vue/lib/logic/uni-utils',
  },
  {
    source: [
      'src/common/tools/uni-utils/update-manager',
      '@tencent/pmd-tools/lib/uni-utils',
    ],
    importedList: [
      'updateManager',
    ],
    target: '@tencent/pmd-vue/lib/logic/uni-utils',
  },
  {
    source: [
      '@tencent/pmd-tools/lib/upload-file',
    ],
    importedList: [
      'uploadFile',
    ],
    target: '@tencent/pmd-vue/lib/logic/upload-file',
  },
  {
    source: 'src/common/tools/router-handler',
    importedList: [
      'getRouteParamsObj',
      'getRouteQueryObj',
      'push',
      'replace',
    ],
    target: '@tencent/pmd-tools/lib/router-handler',
  },
  {
    source: 'src/common/tools/promise-polyfill',
    importedList: [
      'allSettled',
    ],
    target: '@tencent/pmd-tools/lib/promise-polyfill',
  },
  {
    source: [
      'src/common/widget/image-generator.vue',
      'src/common/widget/image-generator',
      'src/common/widget/image-generator/image-generator.vue',
      'src/common/widget/image-generator/image-generator',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/image-generator',
  },
  {
    source: [
      'src/common/widget/qrcode',
      'src/common/widget/qrcode/index.vue',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/qrcode',
  },
  {
    source: [
      'src/common/widget/clipboard',
      'src/common/widget/clipboard/clipboard.vue',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/clipboard',
  },
  {
    source: 'src/common/widget/image-generator',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/image-generator',
  },
  {
    source: [
      'src/common/widget/login',
      'src/common/widget/login/index.vue',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/login',
  },
  {
    source: 'src/common/widget/login/login',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'routerEnter',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/login/login',
  },
  {
    source: [
      'src/common/widget/test-whitelist',
      'src/common/widget/test-whitelist/index.vue',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/test-whitelist',
  },
  {
    source: [
      'src/common/widget/pag-animator',
      'src/common/widget/pag-animator/index',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/pag-animator',
  },
  {
    source: [
      'src/common/widget/video-player',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/video-player',
  },
  {
    source: [
      'src/common/widget/marquee',
      'src/common/widget',
    ],
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportDefaultSpecifier',
      },
    ],
    target: '@tencent/pmd-widget/lib/marquee',
  },
  {
    source: 'src/common/tools/file-utils',
    importedList: [
      'getFileFromUrl',
    ],
    target: '@tencent/pmd-tools/lib/file-utils',
  },
  {
    source: 'src/common/tools/preloader',
    importedList: [
      'Preloader',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'Preloader',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/preloader',
  },
  {
    source: 'src/common/tools/file-saver',
    importedList: [
      'FileSaver',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'FileSaver',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/file-saver',
  },
  {
    source: 'src/common/network/request/axios-manager',
    importedList: [
      'request',
    ],
    target: '@tencent/pmd-network',
  },
  {
    source: [
      'src/common/network/axios',
      '@tencent/pmd-tools/lib/axios',
    ],
    importedList: [
      'axios',
    ],
    target: '@tencent/pmd-network/lib/request/web/axios',
  },
  {
    source: 'src/common/tools/msdk',
    importedList: [
      'sendToMsdkNative',
      'addMsdkNativeCallbackListener',
      'removeMsdkNativeCallbackListener',
      'closeMsdkWebview',
      'closeWebView',
    ],
    target: '@tencent/pmd-tools/lib/msdk',
  },
  {
    source: 'src/common/storage/persist-data',
    importedList: [
      'savePersist',
      'getPersist',
      'clearPersist',
    ],
    target: '@tencent/pmd-tools/lib/storage',
  },
  {
    source: 'src/common/tools/md5',
    importedList: [
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'md5',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/md5',
  },
  {
    source: 'src/common/tools',
    importedList: [
      'initEnv',
      'getEnvUAType',
    ],
    target: '@tencent/pmd-tools/lib/env',
  },
  {
    source: 'src/common/tools',
    importedList: [
      'composeUrlQuery',
    ],
    target: '@tencent/pmd-tools/lib/url',
  },
  {
    source: 'src/common/tools/launchapp/index-v2',
    importedList: [
      'gotoWzGame',
      'gotoGPGame',
      'gotoDzGame',
      'gotoMJGame',
      'gotoLOLMGame',
      'gotoLMJXGame',
      'gotoTLBBGame',
      'gotoX5MGame',
      'gotoCFMGame',
      'gotoTXGDGame',
      'gotoSeedGame',
      'gotoYMZXGame',
      'gotoTDGame',

      'launchApp',
      'gotoWzCommunity',
      'getOpenGameScheme',
    ],
    target: '@tencent/pmd-tools/lib/launchapp/index-v2',
  },
  {
    source: 'src/common/tools/launchapp',
    importedList: [
      'launch',
      'gotoDzGame',
      'gotoWzGame',
      'gotoGPGame',
      'gotoTDGame',
      'gotoMJGame',
      'gotoTLBBGame',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/launchapp',
  },
  {
    source: 'src/common/tools/launchapp/base',
    importedList: [
      'launchApp',
    ],
    target: '@tencent/pmd-tools/lib/launchapp/base',
  },
  {
    source: 'src/common/tools/dialog',
    importedList: [
      'Dialog',
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'Dialog',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-tools/lib/dialog',
  },
  {
    source: 'src/common/tools/visibility',
    importedList: [
      'pollCheckPageVisibility',
    ],
    target: '@tencent/pmd-tools/lib/visibility',
  },
  {
    source: [
      'src/common/network-v2/requestInterceptor/mpParamInterceptor',
      '@tencent/pmd-vue/lib/network',
      '@tencent/pmd-network',
    ],
    importedList: [
      'getLoginCookie',
    ],
    target: '@tencent/pmd-vue/lib/network/interceptor/request/mp/mpParamInterceptor',
  },
  {
    source: [
      '@tencent/pmd-network/lib/interceptor/request/common/fangshua/fangshuaInterceptor',
    ],
    importedList: [
      'FangshuaInterceptor',
    ],
    target: '@tencent/pmd-vue/lib/network/interceptor/request/common/fangshua/fangshuaInterceptor',
  },
  // {
  //   source: 'src/common/tools/jsapi',
  //   importedList: [
  //     'jsApi',
  //     'invokeModes',
  //     'hrefDownload',
  //   ],
  //   target: '@tencent/pmd-tools/lib/jsapi',
  // },
  // {
  //   source: 'src/common/tools/jsapi/types',
  //   importedList: [
  //     'JsApi',
  //   ],
  //   target: '@tencent/pmd-tools/lib/jsapi/types',
  // },
  {
    source: 'src/common/tools/browser',
    importedList: [
      'BROWSER_DEFAULT',
      'BROWSER_SLUG',
      'BROWSER_MSDK',
      'BROWSER_MSDK_EMBEDDED',
      'BROWSER_MSDK_V5',
      'appendUAInfo',
    ],
    target: '@tencent/pmd-tools/lib/browser',
  },
  {
    source: [
      'src/common/tools/debounce',
      'src/common/tools/debounce/index.ts',
    ],
    importedList: [
      'debounce',
    ],
    target: '@tencent/pmd-tools/lib/debounce',
  },
  {
    source: [
      'src/common/vue/app-base',
    ],
    importedList: [
      {
        sourceType: 'ImportSpecifier',
        sourceName: 'appBase',
        targetType: 'ImportNamespaceSpecifier',
      },
      {
        sourceType: 'ImportDefaultSpecifier',
        targetType: 'ImportNamespaceSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/vue/app-base/v2',
  },
  {
    source: [
      'src/common/tools/wzry-game-room',
      'src/common/tools/wzry-game-room/index',
      'src/common/tools/wzry-game-room/index.js',
      '@tencent/pmd-tools/lib/wzry-game-room/index',
    ],
    importedList: [
      'wzryGameRoomHelper',
      ['WzryGameRoomHelper', 'wzryGameRoomHelper'],
      {
        sourceType: 'ImportDefaultSpecifier',
        targetName: 'wzryGameRoomHelper',
        targetType: 'ImportSpecifier',
      },
    ],
    target: '@tencent/pmd-vue/lib/logic/wzry-game-room',
  },
  {
    source: [
      'src/common/tools/wzry-game-room/report-helper',
      'src/common/tools/wzry-game-room/report-helper.ts',
      '@tencent/pmd-tools/lib/wzry-game-room/report-helper',
    ],
    importedList: [
      'REPORT_MATCH_ROOM_DATA_EVENT_ID',
      'REPORT_AI_ROOM_DATA_EVENT_ID',
      'battleIdToObj',
      'reportEvent',
      'reportAiRoomEvent',
      'watchHiddenAndReport',
      'showNotInstalledGameTips',
    ],
    target: '@tencent/pmd-vue/lib/logic/wzry-game-room/report-helper',
  },
];

module.exports = {
  REPLACE_CONFIG,
};
