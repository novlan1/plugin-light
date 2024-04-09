export const PLATFORM_MAP = {
  MP_WX: 'mp-weixin',
  MP_QQ: 'mp-qq',
  MP_ALIPAY: 'mp-alipay',
  H5: 'h5',
} as const;

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


// TODO: 类型补充
export const CSS_POSTFIX_MAP = Object.keys(CSS_MAP)
  .reduce((acc: any, item) => {
    acc[item] = (CSS_MAP[item as keyof typeof CSS_MAP] as string).slice(1);
    return acc;
  }, {});
