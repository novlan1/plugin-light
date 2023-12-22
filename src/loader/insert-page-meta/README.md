## Page Meta 注入

在小程序产物中插入`page-meta`标签。


## 使用方法

在 `vue.config.js` 中配置如下：

```ts
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.insertPageMeta)
      .loader(LOADER_MAP.insertPageMeta)
      .options({
        pages: ['views/sche/sche']
      })
      .end();
  },
};
```

### Loader 参数

| 参数  | 说明       | 类型              | 默认值 |
| ----- | ---------- | ----------------- | ------ |
| pages | 处理的页面 | _Array\<string\>_ | -      |



### 文章

[vue项目转uni-app问题记录](https://juejin.cn/post/7130155200798539783)
