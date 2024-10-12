## TailwindCSS 适配小程序

核心代码来自于 [@uni-helper/vite-plugin-uni-tailwind](https://github.com/uni-helper/vite-plugin-uni-tailwind)。

目前只处理了 `wxml` 和 `wxss`，没有处理脚本文件。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-tailwind -D
```

在 `vue.config.js` 中添加如下设置：


```ts
const { TailwindPlugin } = require('@plugin-light/webpack-plugin-tailwind');

module.exports = {
  configureWebpack: {
    plugins: [
      new TailwindPlugin()
    ]
  }
}
```

### 参数

参考 [@uni-helper/vite-plugin-uni-tailwind](https://github.com/uni-helper/vite-plugin-uni-tailwind)。
