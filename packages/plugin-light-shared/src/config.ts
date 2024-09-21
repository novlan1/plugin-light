export const PLATFORM_MAP = {
  MP_WX: 'mp-weixin',
  MP_QQ: 'mp-qq',
  MP_ALIPAY: 'mp-alipay',
  H5: 'h5',
} as const;


export const ALL_PLATFORM = 'ALL';


export const PLATFORMS_MP = [
  PLATFORM_MAP.MP_WX,
  PLATFORM_MAP.MP_QQ,
];


export const PLATFORMS_ALL = [
  PLATFORM_MAP.MP_WX,
  PLATFORM_MAP.MP_QQ,
  PLATFORM_MAP.H5,
];


export const HTML_MAP = {
  MP_WX: '.wxml',
  MP_QQ: '.qml',
  MP_ALIPAY: '.axml',
  MP_JD: '.jxml',
} as const;

export const CSS_MAP = {
  MP_WX: '.wxss',
  MP_QQ: '.qss',
  MP_ALIPAY: '.acss',
  MP_JD: '.jxss',
} as const;


export const CSS_POSTFIX_MAP = Object.keys(CSS_MAP)
  .reduce((acc: any, item) => {
    acc[item] = (CSS_MAP[item as keyof typeof CSS_MAP] as string).slice(1);
    return acc;
  }, {});


export const CDN_MAP = {
  UNI_SIMPLE_ROUTER: 'https://image-1251917893.cos.ap-guangzhou.myqcloud.com/igame/npm/uni-simple-router/uni-simple-router%402.0.8-beta.4-1.js',
};
