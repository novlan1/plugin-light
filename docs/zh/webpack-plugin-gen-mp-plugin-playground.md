## 生成小程序插件演练场

小程序插件需要一个宿主小程序进行调试，本工具可以帮助 uni-app 项目的小程序插件自动生成这些文件。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-gen-mp-plugin-playground -D
```

在 `vue.config.js` 中添加如下设置：


```ts
const { GenMpPluginPlaygroundPlugin } = require('@plugin-light/webpack-plugin-gen-mp-plugin-playground');


module.exports = {
  configureWebpack: {
    plugins: [
      new GenMpPluginPlaygroundPlugin({})
    ]
  }
}
```

### 参数

```ts
export interface IGenMpPluginPlaygroundOptions {
  // 插件名称
  pluginName?: string;

  // 演练场目录，默认是
  // path.resolve(process.env.UNI_INPUT_DIR, 'mp-plugin-public');
  playgroundDir?: string;

  // 输出目录，默认为 process.env.UNI_OUTPUT_DIR
  outputDir?: string;
}
```
