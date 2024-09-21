## 依赖分析

递归分析依赖，并输出到`log`文件中。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-analyze-deps -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { DepAnalysisPlugin } = require('@plugin-light/webpack-plugin-analyze-deps');

module.exports = {
  configureWebpack: {
    plugins: [
      new DepAnalysisPlugin()
    ],
  }
}
```

