# insert-page-meta

在小程序产物中插入`page-meta`标签。


## 使用方法

在 `vue.config.js` 中配置如下：

```ts
const INSERT_PAGE_META_LOADER = 'uni-plugin-light/lib/loader/insert-page-meta';

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(INSERT_PAGE_META_LOADER)
      .loader(INSERT_PAGE_META_LOADER)
      .options({
        pages: ['views/sche/sche']
      })
      .end();
  },
};
```

## loader参数

| 参数  | 说明       | 类型              | 默认值 |
| ----- | ---------- | ----------------- | ------ |
| pages | 处理的页面 | _Array\<string\>_ | -      |



## 文章

[vue项目转uni-app问题记录](https://juejin.cn/post/7130155200798539783)
