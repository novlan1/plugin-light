export type IBaseConfigOptions = {
  // 是否使用 vue-loader，默认 true
  isUseVueLoader?: boolean;

  // 是否是 Vue3 项目, 默认 false
  isVue3?: boolean;
  // 是否使用 XSS 过滤，需要提前在 Vue 原型上挂载 xss 方法，默认 true
  useXSS?: boolean;

  // 是否使用 ifdef-loader，默认 true
  useIfDefLoader?: boolean;
  // ifdef-loader 要处理的文件
  handleIfDefFiles?: Array<string>;

  // 打包去除 console 日志的方法，默认为 ['console.log', 'console.table']
  terserPureFuncs?: Array<string>;

  // 需要编译的第三方依赖
  transpileDependencies?: Array<string>;

  // 映射的项目
  shadowProjectMap?: Record<string, string>
};

