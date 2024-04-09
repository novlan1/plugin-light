const VUE2_VUE3_COMMON_CDN_URLS = [
  'https://image-1251917893.file.myqcloud.com/igame/npm/axios@0.18.0/dist/axios.min.js',
  'https://image-1251917893.file.myqcloud.com/igame/npm/vue-lazyload@1.3.3/vue-lazyload.js',
  'https://image-1251917893.file.myqcloud.com/igame/common/js/emonitor_custom_46f41566.js',
];

export const DEFAULT_CDN_URLS = [
  'https://image-1251917893.file.myqcloud.com/igame/npm/vue%402.6.10/dist/vue.runtime.min.js',
  'https://image-1251917893.file.myqcloud.com/igame/npm/vue-router@3.5.2/dist/vue-router.min.js',
  'https://image-1251917893.file.myqcloud.com/igame/npm/vuex@3.0.1/dist/vuex.min.js',
  ...VUE2_VUE3_COMMON_CDN_URLS,
];

export const VUE3_CDN_URLS = [
  'https://unpkg.com/vue@3.2.31/dist/vue.runtime.global.prod.js',
  'https://unpkg.com/vue-router@4.0.14/dist/vue-router.global.js',
  'https://unpkg.com/vuex@4.0.2/dist/vuex.global.js',
  ...VUE2_VUE3_COMMON_CDN_URLS,
];


export const DEFAULT_PROJECT_MAP = {
  'project/pvp-match-apply': 'project/match-apply',
  'project/pvp-match-apply-mobile': 'project/match-apply-mobile',

  'project/gp-match-apply': 'project/match-apply',
  'project/gp-match-apply-mobile': 'project/match-apply-mobile',

  'project/lol-match-apply': 'project/match-apply',
  'project/lol-match-apply-mobile': 'project/match-apply-mobile',

  'project/qp-match-apply': 'project/match-apply',
  'project/qp-match-apply-mobile': 'project/match-apply-mobile',
};


export const DEFAULT_HANDLE_IF_DEF_FILES = /(press-ui|component|press-plus).*(\.vue|\.ts|\.js|\.css|\.scss)$/;
