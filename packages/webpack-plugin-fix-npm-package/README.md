## 三方库打包修复

修复 `uni-app` 项目层级过深时，引入`npm`包编译报错问题。

一般的`uni-app`项目层级为`src/main.js`或`packages/user/main.js`，如果你的项目层级比较深，比如`src/project/user/main.js`，可使用此插件。

另一个使用场景是 `pnpm`，使用 `pnpm` 的项目也可能打包异常，使用本插件可以修复此类错误。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-fix-npm-package -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { FixNpmPackagePlugin } = require('@plugin-light/webpack-plugin-fix-npm-package');

module.exports = {
  configureWebpack: {
    plugins: [
      new FixNpmPackagePlugin(),
    ],
  }
}
```
