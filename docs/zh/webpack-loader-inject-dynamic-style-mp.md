## 动态样式注入 - 小程序

注入不同类型的样式文件，小程序可用。

与 `inject-dynamic-style-web` 类似，只是前者可在 `body` 上添加样式，而本 `loader` 必须挂载在页面内部结构中。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-inject-dynamic-style-mp -D
```

在 `vue.config.js` 中配置如下：

```js
const { LOADER: injectDynamicStyleMp } = require('webpack-loader-inject-dynamic-style-mp')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('inject-dynamic-style-mp')
      .test(/(\.vue)$/)
      .use(injectDynamicStyleMp) 
      .loader(injectDynamicStyleMp)
      .options({
        topElement: 'demo-wrap'
      })
      .end();
  }
}
```

## 参数

```ts
export type IInjectDynamicStyleMpOptions = {
  // 顶层元素，，默认 body
  topElement?: string;

  // 处理的平台, 默认 ['h5']
  platforms?: Array<string>;
};
```
