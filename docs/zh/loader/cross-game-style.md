# cross-game-style

`scss`链接的关键词编译，替换关键词`@TIP_STYLE_NAME`。


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const CROSS_GAME_STYLE_LOADER = 'uni-plugin-light/lib/loader/cross-game-style';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(CROSS_GAME_STYLE_LOADER) 
      // 处理样式的loader，必须在vue-loader前执行
      .loader(CROSS_GAME_STYLE_LOADER)
      .end();
  }
}
```


## loader参数

| 参数      | 说明                 | 类型              | 默认值    |
| --------- | -------------------- | ----------------- | --------- |
| styleName | 样式文件名，不含后缀 | _string \| array_ | -         |
| platforms | 处理的平台，默认全部 | _Array\<string\>_ | `['ALL']` |
