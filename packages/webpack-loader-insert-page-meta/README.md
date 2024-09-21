## Page Meta 注入

在小程序产物中插入`page-meta`标签。


## 使用方法

在 `vue.config.js` 中配置如下：

```ts
const { LOADER as insertPageMeta } = require('webpack-loader-insert-page-meta')';

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(insertPageMeta)
      .loader(insertPageMeta)
      .options({
        pages: ['views/sche/sche']
      })
      .end();
  },
};
```

### 参数

```ts
export type IInsertPageMetaOptions = {
  // 处理的页面
  pages?: Array<string>;
};
```

### 文章

[vue项目转uni-app问题记录](https://juejin.cn/post/7130155200798539783)