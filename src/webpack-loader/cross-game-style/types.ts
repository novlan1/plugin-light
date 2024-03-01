export type ICrossGameStyleOptions = {
  // 要替换的样式文件名，不含后缀，默认空，即从项目的 config.js 中获取
  styleName?: string | Array<string>;

  // 处理的平台，默认全部，即 ['ALL']
  platforms?: Array<string>;
};
