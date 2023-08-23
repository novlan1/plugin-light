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
