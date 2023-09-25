# transform-dynamic-comp

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


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const TRANSFORM_DYNAMIC_COMP_LOADER = 'uni-plugin-light/lib/loader/transform-dynamic-comp';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(TRANSFORM_DYNAMIC_COMP_LOADER)
      .loader(TRANSFORM_DYNAMIC_COMP_LOADER)
      .end();
  }
}
```
