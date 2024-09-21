## Vue 中 key 转换


替换 Vue 文件`key`的表示，以解决编译报错。

将

```html
:key="'type' + index"
```

转为

```html
:key="`type-${index}`"
```



### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-replace-vue-key -D
```

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER: replaceVueKey } = require('webpack-loader-replace-vue-key')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(replaceVueKey)
      .loader(replaceVueKey)
      .end();
  }
}
```
