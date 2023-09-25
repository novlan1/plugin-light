# replace-vue-key


替换 Vue 文件`key`的表示，以解决编译报错。

将

```html
:key="'type' + index"
```

转为

```html
:key="`type-${index}`"
```



## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const REPLACE_VUE_KEY_LOADER = 'uni-plugin-light/lib/loader/replace-vue-key';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(REPLACE_VUE_KEY_LOADER)
      .loader(REPLACE_VUE_KEY_LOADER)
      .end();
  }
}
```
