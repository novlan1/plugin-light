<!-- 复制到 docs时，去掉“详细文档”，链接替换: packages/ => zh/ -->
## Plugin Light

`Plugin Light` 是一个丰富、易用的工具集。包含一些 `Webpack` 相关插件，比如

- [依赖分析 (webpack-plugin-analyze-deps)](./packages/webpack-plugin-analyze-deps/)
- [JS分发 (webpack-plugin-dispatch-script)](./packages/webpack-plugin-dispatch-script/)
- [组件分发 (webpack-plugin-dispatch-vue)](./packages/webpack-plugin-dispatch-vue/)
- [npm包打包失败修复 (webpack-plugin-fix-npm-package)](./packages/webpack-plugin-fix-npm-package/)
- [生成版本号 (webpack-plugin-gen-version)](./packages/webpack-plugin-gen-version/)
- [`rem`转`rpx` (webpack-plugin-rem-to-rpx)](./packages/webpack-plugin-rem-to-rpx/)
- [`appId`替换 (webpack-plugin-replace-app-id)](./packages/webpack-plugin-replace-app-id/)
- [拷贝本地文件 (webpack-plugin-transfer-local-file)](./packages/webpack-plugin-transfer-local-file/)
- ...


以及一些 `Webpack Loader`

- [自定义`ifdef` (webpack-loader-ifdef)](./packages/webpack-loader-ifdef/)
- [插入全局组件 (webpack-loader-insert-global-comp)](./packages/webpack-loader-insert-global-comp/)
- [替换三方库 (webpack-loader-replace-library)](./packages/webpack-loader-replace-library/)
- [`v-lazy`兼容 (webpack-loader-v-lazy)](./packages/webpack-loader-v-lazy/)
- [替换动态组件 (webpack-loader-transform-dynamic-comp)](./packages/webpack-loader-transform-dynamic-comp/)
- [替换vue标签 (webpack-loader-replace-template-tag)](./packages/webpack-loader-replace-template-tag/)
- [替换`v-for`中的`key` (webpack-loader-replace-vue-key)](./packages/webpack-loader-replace-vue-key/)
- ...


一些 `Vite Plugin`

- [文件后增加代码 (vite-plugin-add-code-at-end)](./packages/vite-plugin-add-code-at-end/)
- [三方库别名处理 (vite-plugin-alias-for-library)](./packages/vite-plugin-alias-for-library/)
- [样式关键词编译 (vite-plugin-cross-game-style)](./packages/vite-plugin-cross-game-style/)
- [跨平台关键词编译 (vite-plugin-cross-platform)](./packages/vite-plugin-cross-platform/)
- [条件编译 (vite-plugin-ifdef)](./packages/vite-plugin-ifdef/)
- [版本输出 (vite-plugin-gen-version)](./packages/vite-plugin-gen-version/)
- [Rem 转换 (vite-plugin-rem-to-rpx)](./packages/vite-plugin-rem-to-rpx/)
- [动态导入组件语法替换 (vite-plugin-replace-require-dynamic)](./packages/vite-plugin-replace-require-dynamic/)
- [Vue v-lazy 转换 (vite-plugin-transform-v-lazy)](./packages/vite-plugin-transform-v-lazy/)

一些 `Webpack` 基础配置

- [非 uni-app Vue2 项目配置 (project-config-vue)](./packages/project-config-vue/)
- [非 uni-app Vue3 项目配置 (project-config-vite)](./packages/project-config-vite/)
- [uni-app Vue2 项目配置 (project-config-uni-vue)](./packages/project-config-uni-vue/)
- [uni-app Vue3 项目配置 (project-config-uni-vite)](./packages/project-config-uni-vite/)

Postcss Plugin

- [移除选择器 (postcss-plugin-remove-selector)](./packages/postcss-plugin-remove-selector/)

基础包

- [公共包 (plugin-light-shared)](./packages/plugin-light-shared/)
- [Vue2 公共包 (plugin-light-shared-vue2)](./packages/plugin-light-shared-vue2/)
- [预处理器 (plugin-light-preprocess)](./packages/plugin-light-preprocess/)
- [Vite 版本的路由读取 (uni-read-pages-vite)](./packages/uni-read-pages-vite/)

### 安装

每个包名称不同，下面是一个示例：

```bash
npm install -D project-config-vite
```

### 插件使用示例

```js
// vue.config.js

const { DispatchScriptPlugin } = require('webpack-plugin-dispatch-vue');

let plugins = []

if (process.env.NODE_ENV === 'production') {
  // js分发
  plugins.push(new DispatchScriptPlugin());
}

module.exports = {
  configureWebpack: {
    plugins,
  }
}
```

`Webpack Plugin`、`Vite Plugin`、`Project Config` 均可以采用这种引入方式。


### Loader 使用示例

每个 `Webpack Loader` 都会导出 `LOADER` 和 `LOADER_PROD` 两个变量，分别对应 `loader.js`、`loader.prod.js` 的文件路径。

业务可以像下面这样使用：

```js
// vue.config.js

const { LOADER as ifdef } = 'webpack-loader-ifdef';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('ifdef-loader')
      // 根据项目实际配置文件类型
      .test(/press-ui.*(\.vue|\.ts|\.js|\.css|\.scss)$/)
      // 不要配成下面这样，会卡住
      // .test(/\.vue|\.ts|\.js|\.css|\.scss$/) 
      .use(ifdef)
      .loader(ifdef)
      .options({
        context: { H5: true },
        type: ['css', 'js', 'html'],
      })
      .end();
  }
}
```


### 详细文档

[点此查看](https://novlan1.github.io/uni-plugin-light/)


### 迁移至 monorepo 

`plugin-light` 不再维护，后续只更新 `monorepo` 包。

