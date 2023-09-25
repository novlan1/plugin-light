# replace-template-tag

替换 Vue 模板中的标签，比如把`REPLACE_TAG_SCROLL_VIEW`在`web`端替换成`div`，在小程序端替换为`scroll-view`。


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const CrossGameStyleLoader = 'uni-plugin-light/lib/loader/replace-template-tag';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(REPLACE_TMP_TAG_LOADER)
      .loader(REPLACE_TMP_TAG_LOADER)
      .options({
        replaceTmpTagMap: {
          REPLACE_TAG_SCROLL_VIEW: {
            web: 'div',
            mp: 'scroll-view',
          },
        }
      })
      .end();
  }
}
```
