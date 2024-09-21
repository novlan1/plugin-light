export type IAddCodeAtEndItem = {
  // 文件名，或文件名关键字
  id: string | RegExp;
  // 要添加的代码
  code: string;
  // 是否精确匹配文件
  exact?: boolean;
  // 要匹配的文件数据，设置为 1 时，可防止重复添加
  number?: number;
};

export type IAddCodeAtEndOptions = {
  list?: Array<IAddCodeAtEndItem>;
};
