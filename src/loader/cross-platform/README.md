# cross-platform

跨平台的关键词编译，替换关键词`@TIP_PLATFORM_NAME`。


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const CROSS_PLATFORM_LOADER = 'uni-plugin-light/lib/loader/cross-platform';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(CROSS_PLATFORM_LOADER) 
      // 处理样式的loader，必须在vue-loader前执行
      .loader(CROSS_PLATFORM_LOADER)
      .end();

  config.module
    .rule('js')
    .test(/\.[jt]s$/)
    .use(CROSS_PLATFORM_LOADER) 
    .loader(CROSS_PLATFORM_LOADER)
    .end();
  }
}
```
