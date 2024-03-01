export type IDispatchVueOptions = {
  // 是否修复 npm 包，即使用 fix-npm-package 插件
  useFixNpm?: boolean;
  // 是否插入 vendor 的引用
  insertRequireVendor?: boolean;

  // 是否需要日志，默认 false
  needLog?: boolean;
  // 是否仅返回全局组件，默认 false
  needGlobalComponents?: boolean;

  moveComponents?: {
    // 最大分包使用数目，超过这个值后不会移动，默认 10000000
    minUseTimes: number;
    // 禁止移动的组件列表
    disableList: Array<string>;
  },
};


export type IMovingComponents = Array<{
  sourceRef: string;
  targetRef: string;
  subPackage: string;
}>;

export type IReplaceRefList = Array<Array<string>>;

export type IRefMap = Record<string, IReplaceRefList>;
