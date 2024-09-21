## 跨平台关键词编译

跨平台的关键词编译，替换关键词`@TIP_PLATFORM_NAME`。


### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-cross-platform -D
```

在 `vue.config.js` 中配置如下：

```js
const { LOADER: crossPlatform, LOADER_PROD: crossPlatformProd } = require('webpack-loader-cross-platform')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(crossPlatform) 
      // 处理样式的loader，必须在vue-loader前执行
      .loader(crossPlatform)
      .end();

  config.module
    .rule('js')
    .test(/\.[jt]s$/)
    .use(crossPlatformProd) 
    .loader(crossPlatformProd)
    .end();
  }
}
```
