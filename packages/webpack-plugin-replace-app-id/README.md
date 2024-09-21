## 小程序 AppId 转换

可用于动态替换小程序编译产物的`project.config.json`中的`appid`，适用于一个子工程下，不同页面属于不同小程序的场景。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-replace-app-id -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { ReplaceAppIdPlugin } = require('@plugin-light/webpack-plugin-replace-app-id');


module.exports = {
  configureWebpack: {
    plugins: [
      new ReplaceAppIdPlugin({
        appId: 'xxx'
      })
    ],
  }
}
```

### 参数

```ts
export type IReplaceAppIdOptions = {
  // 将要替换的 appId
  appId: string;
};
```
