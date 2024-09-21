## 动态组件转为用时注入

可以将动态引入的组件转为用户注入，动态组件指的是用 `require([''], resolve)` 方式引入的组件。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-add-placeholder -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { AddPlaceHolderPlugin } = require('@plugin-light/webpack-plugin-add-placeholder');
const { LOADER as transformDynamicComp } = require('@plugin-light/webpack-loader-transform-dynamic-comp');
const { LOADER as autoPlaceholder } = require('@plugin-light/webpack-loader-auto-placeholder');


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
      .use(transformDynamicComp)
      .loader(transformDynamicComp)
      .end()
      .use(autoPlaceholder)
      .loader(autoPlaceholder)
      .end();
  },
}
```

