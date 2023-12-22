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

  // 需移动的外层目录列表
  adapterDirs?: Array<string>;
  // 待转换的三方依赖
  transpileDependencies?: Array<string>;
  // 是否校验 eslint
  lintOnSave?: boolean;
};
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

