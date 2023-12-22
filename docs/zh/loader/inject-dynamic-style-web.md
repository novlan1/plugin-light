## 动态样式注入 - H5

注入不同类型的样式文件。

### 如何使用

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('inject-dynamic-style')
      .test(/(css\/base\.scss)$/)
      .use(LOADER_MAP.injectDynamicStyleWeb) 
      .loader(LOADER_MAP.injectDynamicStyleWeb)
      .end();
  }
}
```

## loader 参数

| 参数       | 说明       | 类型              | 默认值   |
| ---------- | ---------- | ----------------- | -------- |
| topElement | 顶层元素   | _string_          | body     |
| platforms  | 处理的平台 | _Array\<string\>_ | `['h5']` |



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