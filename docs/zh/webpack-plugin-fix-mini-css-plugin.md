## 修复 mini-css-extract-plugin

可用于 `uni-app` 小程序下，去掉由 `mini-css-extract-plugin` 注入的异步加载样式代码。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-fix-mini-css-plugin -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { FixMiniCssPlugin } = require('@plugin-light/webpack-plugin-fix-mini-css-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new FixMiniCssPlugin()
    ],
  }
}
```

