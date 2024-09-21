## GlobalThis 垫片

对没有 `globalThis` 的环境进行 `polyfill`，比如 QQ 小程序。

### 如何使用

安装

```bash
pnpm add webpack-plugin-global-this-polyfill -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { GlobalThisPolyfillPlugin } = require('webpack-plugin-global-this-polyfill');


module.exports = {
  configureWebpack: {
    plugins: [new GlobalThisPolyfillPlugin()],
  }
}
```