export type GetUniVueConfig = {
  // Loader 部分
  // 是否使用转换动态引入组件
  useTransformDynamicCompLoader?: boolean;
  // 是否使用 auto placeholder loader
  useAutoPlaceHolderLoader?: boolean;
  // 是否使用替换 vue key loader
  useReplaceVueKeyLoader?: boolean;
  // 是否使用处理 swipe 组件的 loader
  useSwipeComponentLoader?: boolean;

  // 是否使用自动插入全局组件 loader
  useInsertGlobalCompLoader?: boolean;
  // 自动插入全局组件选项
  insertGlobalCompLoaderOptions?: any;

  // 是否使用替换三方库 loader
  useReplaceLibraryLoader?: boolean;
  // 替换三方库选项
  replaceLibraryLoaderOptions?: any;

  // 是否使用替换模板标签
  useReplaceTemplateTagLoader?: boolean;
  // 替换模板标签选项
  replaceTemplateTagLoaderOptions?: any;

  // 是否使用 v-lazy loader
  useVLazyLoader?: boolean;
  // v-lazy loader 选项
  vLazyLoaderOptions?: any;

  // 是否使用插入 page-meta loader
  useInsertPageMetaLoader?: boolean;
  // 插入 page-meta loader 选项
  insertPageMetaLoaderOptions?: any;


  // 插件部分
  // 是否使用 copy dir 插件
  useCopyDirPlugin?: boolean;
  // copy dir 插件选项
  copyDirPluginOptions?: Record<string, any>;

  // 是否使用脚本派发插件
  useDispatchScriptPlugin?: boolean;
  dispatchScriptPluginOptions?: any;

  // 是否使用组件派发插件
  useDispatchVuePlugin?: boolean;
  dispatchVuePluginOptions?: any;

  // 是否使用 xss 方法包裹 v-html 内容，需提前注册全局方法
  useXSS?: boolean;
  // 是否使用 add placeholder 插件
  useAddPlaceHolderPlugin?: boolean;

  //  mp 条件下, rem to rpx 插件选项
  remToRpxPluginMpOptions?: any;

  // web 下，生成版本插件选项
  genVersionWebPluginOptions?: any;

  // 需移动的外层目录列表
  adapterDirs?: Array<string>;


  // 通用部分
  // 待转换的三方依赖
  transpileDependencies?: Array<string>;
  // 是否校验 eslint
  lintOnSave?: boolean;
};
