# webpack 基础配置

`webpack` 配置，适用于基于 Vue 的 `web` 项目。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：


```js
const { WEBPACK_BASE_CONFIG } = require('uni-plugin-light/lib/webpack-base-config');
const { merge } = require('webpack-merge');

module.exports = merge(WEBPACK_BASE_CONFIG, {
  transpileDependencies: ['press-ui'],
});
```

或者使用 `getWebpackBaseConfig` 方法：



```js
const { getWebpackBaseConfig } = require('uni-plugin-light/lib/webpack-base-config');
const { merge } = require('webpack-merge');

module.exports = merge(getWebpackBaseConfig({
  isUseVueLoader: true,
  isVue3: false,
  useXSS: true,
}), {
  transpileDependencies: ['press-ui'],
});
```

## getWebpackBaseConfig 参数

`getWebpackBaseConfig` 接收一个对象作为参数，其属性及说明如下：


| 参数           | 说明                                                  | 类型      | 默认值  |
| -------------- | ----------------------------------------------------- | --------- | ------- |
| isUseVueLoader | 是否使用`vue-loader`                                  | _boolean_ | `true`  |
| isVue3         | 是否是 Vue3 项目                                      | _boolean_ | `false` |
| useXSS         | 是否使用`XSS`过滤，需要提前在 Vue 原型上挂载`xss`方法 | _boolean_ | `true`  |


