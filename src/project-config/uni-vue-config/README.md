## uni-app 项目基础配置

`Vue.config.js` 配置，适用于 uni-app 项目。

### 如何使用

在 `vue.config.js` 中添加如下设置：

```js
const { getUniVueConfig } = require('plugin-light/lib/uni-vue-config');
const { merge } = require('webpack-merge');

module.exports = merge(getUniVueConfig(), {});
```

### 类型说明

#### getUniVueConfig 参数

```ts
type GetUniVueConfig = {
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
  // 默认为 true
  aegisWebSdkExternal?: boolean | string;

  // 默认为 false
  uniSimpleRouterExternal?: boolean | string;

  customPreload?: boolean | ICustomPreloadOptions;

  // 是否需要 sourceMap
  needSourceMap?: boolean;

  usePMDBusinessAlias?: boolean;

  // 是否使用 work-box
  useWorkBoxPlugin?: Record<string, any>;

  // 是否保存 bundle-analyze 结果到 html 中
  saveBundleAnalyzeHtml?: Record<string, any>;
}
```

#### transpileDependencies

`transpileDependencies` 默认值如下：

```ts
['press-ui', 'press-plus', 'pmd-merchant-ui'];
```

#### adapterDirs

`adapterDirs` 默认值如下：

```ts
[
  'comm',
  'common',
  'component',
  'live-component',
  'logic',
  'local-logic',
  'local-component',
  'login',
  'pages',
  'static',
  'node-modules',
]
```

### 打包产物分析

当 `process.env.npm_config_report` 不为 `falsy` 时，本工具会使用 `webpack-bundle-analyzer` 插件，开发者可用来进行打包分析。

当传入 `saveBundleAnalyzeHtml` 不为 `falsy` 时，会在 `production` 模式下，保存打包分析产物到 `my-bundle-analyze.html` 文件中，可以在流水线中进行归档。

### 调试模式

当 `process.env.DEBUG_MODE` 不为 `falsy` 时，本工具会设置 `configureWebpack.optimization.minimize` 为 `false`，开发者可以用来进行产物分析。

### sourceMap

`options.needSourceMap` 的默认值为：

```ts
checkH5() && process.env.NODE_ENV === 'production' && getGitCurBranch(__dirname) === 'release';
```

传入布尔值时，会取传入的值。

内部实现方式：

```ts
configureWebpack: {
  ...(needSourceMap ? {
    devtool: 'hidden-source-map',
  } : {}),
}
```

研发平台子项目中填有 TAM_ID（上报ID） 的话，会在发布正式环境时，将 `sourceMap` 文件后上传到 TAM 平台对应的项目下。

可以在查看错误文件的时候，选择对应的 `sourceMap`，注意不用带域名，直接输入文件名，比如 `main.1212.js.map`。
