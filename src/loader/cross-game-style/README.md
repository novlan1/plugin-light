## 样式关键词编译

`scss`链接的关键词编译，替换关键词`@TIP_STYLE_NAME`。


### 如何使用

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.crossGameStyle) 
      // 处理样式的loader，必须在vue-loader前执行
      .loader(LOADER_MAP.crossGameStyle)
      .end();
  }
}
```


### Loader 参数

| 参数      | 说明                 | 类型              | 默认值    |
| --------- | -------------------- | ----------------- | --------- |
| styleName | 样式文件名，不含后缀 | _string \| array_ | -         |
| platforms | 处理的平台，默认全部 | _Array\<string\>_ | `['ALL']` |
