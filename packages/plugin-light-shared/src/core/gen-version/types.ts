export type IGenVersionOptions = {
  // 传入 buildName 时，会将构建信息插入到 buildName 中
  buildName?: string;

  // 传入 commitName 时，会将最后一次提交信息插入到 commitName 中
  commitName?: string;

  // 延迟打印时间，单位 ms，默认 10
  delay?: number;
};
