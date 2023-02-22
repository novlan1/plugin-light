# JS分发插件

可以将只有分包只有的JS/TS移动到相应的分包内。

## 使用方式

在`vue.config.js`中进行如下配置：

```ts
const {
  DispatchScriptPlugin,
} = require('uni-plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      DispatchScriptPlugin()
    ],
  }
}
```


## 文章

[uni-app分包优化——JS分发](https://juejin.cn/post/7134873335301128229)

