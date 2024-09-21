## Vue 模板标签转换

替换 Vue 模板中的标签，比如把`REPLACE_TAG_SCROLL_VIEW`在`web`端替换成`div`，在小程序端替换为`scroll-view`。


### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-replace-template-tag -D
```

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER as replaceTemplateTag } = require('webpack-loader-replace-template-tag')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(replaceTemplateTag)
      .loader(replaceTemplateTag)
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

### 参数

```ts
export type IReplaceTemplateTagOptions = {
  // 替换标签映射表
  replaceTmpTagMap?: {
    [k: string]: {
      mp: string;
      web: string;
    }
  }
};
```
