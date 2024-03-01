export type IDispatchScriptOptions = {
  // 禁止移动的白名单列表
  whiteList?: Array<string>;
};

export type IChunks = Array<{
  name: string;
}>;

export type IModule = {
  resource: string;
  type: string;
  getChunks: () => any;
};
