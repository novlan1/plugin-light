## 动态引入组件转换

替换动态组件。

比如下面的动态组件：

```ts
components: {
  xxComp(resolve) {
    require(['xx.comp'], resolve);
  },
}
```

会被转为：

```ts
import xxComp from 'xx.comp';

components: {
  xxComp,
}
```


### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-transform-dynamic-comp -D
```

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER: transformDynamicComp } = require('webpack-loader-transform-dynamic-comp')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(transformDynamicComp)
      .loader(transformDynamicComp)
      .end();
  }
}
```
