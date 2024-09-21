import type { ICrossModuleStyleOptions } from 'webpack-loader-cross-module-style';
import type { IInsertGlobalCompOptions } from 'webpack-loader-insert-global-comp';
import type { ICopyDirOptions } from 'webpack-plugin-copy-dir';

import type { IDispatchScriptOptions } from 'webpack-plugin-dispatch-script';
import type { IDispatchVueOptions } from 'webpack-plugin-dispatch-vue';
import type { IRemToRpxOptions } from 'webpack-plugin-rem-to-rpx';

import type { IGenVersionOptions } from 'webpack-plugin-gen-version';
import type { ICustomPreloadOptions } from 'webpack-plugin-custom-preload';
import type { IReplaceUniH5PluginOption } from 'webpack-plugin-replace-uni-h5';


export type GetUniVueConfig = {
  // Loader 部分
  // 是否使用转换动态引入组件
  useTransformDynamicCompLoader?: boolean;
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
  insertPageMetaLoaderOptions?: IInsertGlobalCompOptions;
  crossModuleStyleLoaderOptions?: ICrossModuleStyleOptions;


  // 插件部分
  // 是否使用 copy dir 插件
  useCopyDirPlugin?: boolean;
  // copy dir 插件选项
  copyDirPluginOptions?: ICopyDirOptions;

  // 是否使用脚本派发插件
  useDispatchScriptPlugin?: boolean;
  dispatchScriptPluginOptions?: IDispatchScriptOptions;

  // 是否使用组件派发插件
  useDispatchVuePlugin?: boolean;
  dispatchVuePluginOptions?: IDispatchVueOptions;

  // 是否使用 xss 方法包裹 v-html 内容，需提前注册全局方法
  useXSS?: boolean;
  // 是否使用 add placeholder 插件，为 true 时，也会使用 动态引入组件的替换插件
  useAddPlaceHolderPlugin?: boolean;

  //  mp 条件下, rem to rpx 插件选项
  remToRpxPluginMpOptions?: IRemToRpxOptions;

  // web 下，生成版本插件选项
  genVersionWebPluginOptions?: IGenVersionOptions;

  // 需移动的外层目录列表
  adapterDirs?: Array<string>;


  // 通用部分
  // 待转换的三方依赖
  transpileDependencies?: Array<string>;
  // 是否校验 eslint
  lintOnSave?: boolean;

  // 是否使用 H5 的 splitChunks 配置
  // 如果是对象类型，则直接传递给 config.optimization.splitChunks
  useH5SplitChunks?: boolean | Record<string, any>;

  // 是否使用 fix-mini-css-plugin
  useFixMiniCssPlugin?: boolean;

  // aegis-web-sdk 是否使用外链
  // 传入 string 会覆盖之前的链接
  aegisWebSdkExternal?: boolean | string;
  uniSimpleRouterExternal?: boolean | string;
  axiosExternal?: boolean | string;
  vueLazyloadExternal?: boolean | string;

  customPreload?: boolean | ICustomPreloadOptions;

  // 是否需要 sourceMap
  needSourceMap?: boolean;

  usePMDBusinessAlias?: boolean;

  // 是否使用 work-box
  useWorkBoxPlugin?: Record<string, any>;

  // 是否保存 bundle-analyze 结果到 html 中
  saveBundleAnalyzeHtml?: boolean | Record<string, any>;


  // 是否使用 replaceUniH5Plugin
  useReplaceUniH5Plugin?: IReplaceUniH5PluginOption;

  // 是否使用 removeScoped loader
  useRemoveScopedLoader?: any;
};
