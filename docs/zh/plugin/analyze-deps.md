# 依赖分析插件

递归分析依赖，并输出到`log`文件中。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```ts
const {
  DepAnalysisPlugin,
} = require('uni-plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new DepAnalysisPlugin()
    ],
  }
}
```

