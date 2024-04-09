## 动态组件转为用时注入

可以将动态引入的组件转为用户注入，动态组件指的是用 `require([''], resolve)` 方式引入的组件。

### 如何使用

在 `vue.config.js` 中添加如下设置：

```ts
const { AddPlaceHolderPlugin } = require('plugin-light/lib/plugin');
const { LOADER_MAP } = 'plugin-light/lib/loader';


module.exports = {
  configureWebpack: {
    plugins: [
      new AddPlaceHolderPlugin()
    ],
  },
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.transformDynamicComp)
      .loader(LOADER_MAP.transformDynamicComp)
      .end()
      .use(LOADER_MAP.autoPlaceholder)
      .loader(LOADER_MAP.autoPlaceholder)
      .end();
  },
}
```

