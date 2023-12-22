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

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.replaceVueKey)
      .loader(LOADER_MAP.replaceVueKey)
      .end();
  }
}
```
