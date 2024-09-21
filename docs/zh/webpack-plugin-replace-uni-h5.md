## 替换 uni-h5

使用自定义的包，替换 uni-h5 包，用于减小包体积。

主要减少了下面内容：

内置组件

- audio
- canvas
- checkbox
- checkbox-group
- editor
- form
- movable-area
- movable-view
- picker-view
- picker-view-column
- progress
- radio
- radio-group
- switch

uni-app 核心组件

- Modal
- Toast
- Preview Image
- Action Sheet
- Choose Location
- Open Location



### 如何使用

安装

```bash
pnpm add webpack-plugin-replace-uni-h5 -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { ReplaceUniH5Plugin } = require('webpack-plugin-replace-uni-h5');

const plugins = []

plugins.push(
  new ReplaceUniH5Plugin({
    version: 'v2.0.1-alpha-36920221111001',
  })
)

module.exports = {
  configureWebpack: {
    plugins,
  }
}
```

### 参数

```ts
export interface IReplaceUniH5PluginOption {
  // uni-h5 版本，比如 v2.0.1-alpha-36920221111001
  // 找不到对应的文件时，插件使用失败
  version: String;
}
```
