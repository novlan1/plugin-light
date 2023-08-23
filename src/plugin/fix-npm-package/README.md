# fix-npm-package

修复 `uni-app` 项目层级过深时，引入`npm`包编译报错问题。

一般的`uni-app`项目层级为`src/main.js`或`packages/user/main.js`，如果你的项目层级比较深，比如`src/project/user/main.js`，可使用此插件。


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：


```ts
const {
  FixNpmPackagePlugin,
} = require('uni-plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new FixNpmPackagePlugin(),
    ],
  }
}
```
