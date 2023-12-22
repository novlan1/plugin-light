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

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.transformDynamicComp)
      .loader(LOADER_MAP.transformDynamicComp)
      .end();
  }
}
```
