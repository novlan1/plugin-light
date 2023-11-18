# inject-dynamic-style

注入不同类型的样式文件。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const INJECT_DYNAMIC_STYLE = 'uni-plugin-light/lib/loader/inject-dynamic-style';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('inject-dynamic-style')
      .test(/(css\/base\.scss)$/)
      .use(INJECT_DYNAMIC_STYLE) 
      .loader(INJECT_DYNAMIC_STYLE)
      .end();
  }
}
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