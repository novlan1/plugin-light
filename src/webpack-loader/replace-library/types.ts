export type IReplaceLibraryOptions = {
  // 替换引用路径列表
  replaceLibraryList?: Array<{
    // 源地址
    from: string;
    // 目标地址
    to: string;
    // 是否精确查找, 默认false
    exact?: boolean
  }>;

  // 替换文件内容列表
  replaceContentList?: Array<{
    // 源地址
    path: string;
    // 文件内容
    content: Function | string;
  }>
};
