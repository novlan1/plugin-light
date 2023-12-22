## JS 分发

可以将只有分包使用的`javascript/typescript`，移动到相应的分包内。

### 如何使用

在 `vue.config.js` 中添加如下设置：

```ts
const { DispatchScriptPlugin } = require('plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new DispatchScriptPlugin()
    ],
  }
}
```


### 文章

[uni-app分包优化——JS分发](https://juejin.cn/post/7134873335301128229)

