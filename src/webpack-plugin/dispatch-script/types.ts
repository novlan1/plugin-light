export type IDispatchScriptOptions = {
  // 禁止移动的白名单列表
  whiteList?: Array<string>;

  // 是否增加 common/vendor 的引用
  addCommonVendorRequire?: boolean;
};

export type IChunks = Array<{
  name: string;
}>;

export type IModule = {
  resource: string;
  type: string;
  getChunks: () => any;
};
