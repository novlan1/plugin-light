## 动态样式注入 - H5

注入不同类型的样式文件。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-inject-dynamic-style-web -D
```

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER as injectDynamicStyleWeb } = require('webpack-loader-inject-dynamic-style-web')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('inject-dynamic-style')
      .test(/(css\/base\.scss)$/)
      .use(injectDynamicStyleWeb) 
      .loader(injectDynamicStyleWeb)
      .end();
  }
}
```

## 参数

```ts
export type IInjectDynamicStyleWebOptions = {
  // 顶层元素，，默认 body
  topElement?: string;

  // 处理的平台, 默认 ['h5']
  platforms?: Array<string>;
};
```

## 说明

该 `loader` 会在`base.scss`文件中注入以下样式，使得页面可以动态显示不同类型的样式。

```ts
const styleStr = styleList.map(item => `
&--type-${item} {
  @import './${item}.scss';
}`).join('\n');

const content = `
/* #ifdef H5 */
body.${componentName} {
  ${styleStr}
}
/* #endif */
`;
```

<img src="https://mike-1255355338.cos.ap-guangzhou.myqcloud.com/article/2023/11/own_mike_4c2a77c7fa33d7f435.png" width="500"/>