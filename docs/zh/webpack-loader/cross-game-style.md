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


### 参数

```ts
export type ICrossGameStyleOptions = {
  // 要替换的样式文件名，不含后缀，默认空，即从项目的 config.js 中获取
  styleName?: string | Array<string>;

  // 处理的平台，默认全部，即 ['ALL']
  platforms?: Array<string>;
};
```
