<!-- 复制到 docs时，去掉“详细文档”，链接替换: zh/ => zh/ -->
## Plugin Light

`Plugin Light` 是一个丰富、易用的工具集。包含一些 `Webpack` 相关插件，比如

- [依赖分析 (webpack-plugin-analyze-deps)](./zh/webpack-plugin-analyze-deps/)
- [脚本分发 (webpack-plugin-dispatch-script)](./zh/webpack-plugin-dispatch-script/)
- [组件分发 (webpack-plugin-dispatch-vue)](./zh/webpack-plugin-dispatch-vue/)
- [npm包打包失败修复 (webpack-plugin-fix-npm-package)](./zh/webpack-plugin-fix-npm-package/)
- [生成版本号 (webpack-plugin-gen-version)](./zh/webpack-plugin-gen-version/)
- [`rem`转`rpx` (webpack-plugin-rem-to-rpx)](./zh/webpack-plugin-rem-to-rpx/)
- [`appId`替换 (webpack-plugin-replace-app-id)](./zh/webpack-plugin-replace-app-id/)
- [拷贝本地文件 (webpack-plugin-transfer-local-file)](./zh/webpack-plugin-transfer-local-file/)
- ...


以及一些 `Webpack Loader`

- [自定义`ifdef` (webpack-loader-ifdef)](./zh/webpack-loader-ifdef/)
- [插入全局组件 (webpack-loader-insert-global-comp)](./zh/webpack-loader-insert-global-comp/)
- [替换三方库 (webpack-loader-replace-library)](./zh/webpack-loader-replace-library/)
- [`v-lazy`兼容 (webpack-loader-v-lazy)](./zh/webpack-loader-v-lazy/)
- [替换动态组件 (webpack-loader-transform-dynamic-comp)](./zh/webpack-loader-transform-dynamic-comp/)
- [替换vue标签 (webpack-loader-replace-template-tag)](./zh/webpack-loader-replace-template-tag/)
- [替换`v-for`中的`key` (webpack-loader-replace-vue-key)](./zh/webpack-loader-replace-vue-key/)
- ...


一些 `Vite Plugin`

- [文件后增加代码 (vite-plugin-add-code-at-end)](./zh/vite-plugin-add-code-at-end/)
- [三方库别名处理 (vite-plugin-alias-for-library)](./zh/vite-plugin-alias-for-library/)
- [样式关键词编译 (vite-plugin-cross-game-style)](./zh/vite-plugin-cross-game-style/)
- [跨平台关键词编译 (vite-plugin-cross-platform)](./zh/vite-plugin-cross-platform/)
- [条件编译 (vite-plugin-ifdef)](./zh/vite-plugin-ifdef/)
- [版本输出 (vite-plugin-gen-version)](./zh/vite-plugin-gen-version/)
- [Rem 转换 (vite-plugin-rem-to-rpx)](./zh/vite-plugin-rem-to-rpx/)
- [动态导入组件语法替换 (vite-plugin-replace-require-dynamic)](./zh/vite-plugin-replace-require-dynamic/)
- [Vue v-lazy 转换 (vite-plugin-transform-v-lazy)](./zh/vite-plugin-transform-v-lazy/)

一些 `Webpack` 基础配置

- [非 uni-app Vue2 项目配置 (project-config-vue)](./zh/project-config-vue/)
- [非 uni-app Vue3 项目配置 (project-config-vite)](./zh/project-config-vite/)
- [uni-app Vue2 项目配置 (project-config-uni-vue)](./zh/project-config-uni-vue/)
- [uni-app Vue3 项目配置 (project-config-uni-vite)](./zh/project-config-uni-vite/)

Postcss Plugin

- [移除选择器 (postcss-plugin-remove-selector)](./zh/postcss-plugin-remove-selector/)

基础包

- [公共包 (plugin-light-shared)](./zh/plugin-light-shared/)
- [Vue2 公共包 (plugin-light-shared-vue2)](./zh/plugin-light-shared-vue2/)
- [预处理器 (plugin-light-preprocess)](./zh/plugin-light-preprocess/)
- [Vite 版本的路由读取 (uni-read-pages-vite)](./zh/uni-read-pages-vite/)

### 安装

每个包名称不同，下面是一个示例：

```bash
npm install -D @plugin-light/project-config-vite
```

### 插件使用示例

```js
// vue.config.js

const { DispatchScriptPlugin } = require('@plugin-light/webpack-plugin-dispatch-vue');

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

const { LOADER as ifdef } = '@plugin-light/webpack-loader-ifdef';

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

### 迁移至 monorepo 

`plugin-light` 不再维护，后续只更新 `monorepo` 包。

