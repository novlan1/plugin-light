## Plugin Light

`Webpack` 相关插件，包括

- [依赖分析](./zh/webpack-plugin/analyze-deps/)
- [JS分发](./zh/webpack-plugin/dispatch-script/)
- [组件分发](./zh/webpack-plugin/dispatch-vue/)
- [npm包打包失败修复](./zh/webpack-plugin/fix-npm-package/)
- [生成版本号](./zh/webpack-plugin/gen-version/)
- [`rem`转`rpx`](./zh/webpack-plugin/rem-to-rpx/)
- [`appId`替换](./zh/webpack-plugin/replace-app-id/)
- [拷贝本地文件](./zh/webpack-plugin/transfer-local-file/)
- ...


以及一些 `Loader`

- [自定义`ifdef`](./zh/webpack-loader/ifdef-loader/)
- [插入全局组件](./zh/webpack-loader/insert-global-comp/)
- [替换三方库](./zh/webpack-loader/replace-library/)
- [`v-lazy`兼容](./zh/webpack-loader/v-lazy/)
- [替换动态组件](./zh/webpack-loader/transform-dynamic-comp/)
- [替换vue标签](./zh/webpack-loader/replace-template-tag/)
- [替换`v-for`中的`key`](./zh/webpack-loader/replace-vue-key/)
- ...

还有一些`webpack`基础配置和 CLI 命令。

### 安装

```
npm install -D plugin-light
```


### 插件使用示例

```js
// vue.config.js

const { DispatchScriptPlugin } = require('plugin-light/lib/plugin');

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

### loader 使用示例

```js
// vue.config.js

const { LOADER_MAP } = 'plugin-light/lib/loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('ifdef-loader')
      // 根据项目实际配置文件类型
      .test(/press-ui.*(\.vue|\.ts|\.js|\.css|\.scss)$/)
      // 不要配成下面这样，会卡住
      // .test(/\.vue|\.ts|\.js|\.css|\.scss$/) 
      .use(LOADER_MAP.ifdef)
      .loader(LOADER_MAP.ifdef)
      .options({
        context: { H5: true },
        type: ['css', 'js', 'html'],
      })
      .end();
  }
}
```
