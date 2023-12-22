## Vue 项目基础配置

`webpack` 配置，适用于基于 Vue 的 `web` 项目。

### 如何使用

在 `vue.config.js` 中添加如下设置：

```js
const { WEBPACK_BASE_CONFIG } = require('plugin-light/lib/webpack-base-config');
const { merge } = require('webpack-merge');

module.exports = merge(WEBPACK_BASE_CONFIG, {
  transpileDependencies: ['press-ui'],
});
```

或者使用 `getWebpackBaseConfig` 方法：



```js
const { getWebpackBaseConfig } = require('plugin-light/lib/webpack-base-config');
const { merge } = require('webpack-merge');

module.exports = merge(getWebpackBaseConfig({
  isUseVueLoader: true,
  isVue3: false,
  useXSS: true,
}), {
  transpileDependencies: ['press-ui'],
});
```

### getWebpackBaseConfig 参数

`getWebpackBaseConfig` 接收一个对象作为参数，其属性及说明如下：


| 参数                  | 说明                                                  | 类型      | 默认值                             |
| --------------------- | ----------------------------------------------------- | --------- | ---------------------------------- |
| isUseVueLoader        | 是否使用`vue-loader`                                  | _boolean_ | `true`                             |
| isVue3                | 是否是 Vue3 项目                                      | _boolean_ | `false`                            |
| useXSS                | 是否使用`XSS`过滤，需要提前在 Vue 原型上挂载`xss`方法 | _boolean_ | `true`                             |
| useIfDefLoader        | 是否使用`ifdef-loader`                                | _boolean_ | `true`                             |
| handleIfDefFiles      | `ifdef-loader` 要处理的文件                           | _Regexp_  | 参见下方                           |
| terserPureFuncs       | 打包去除`console`日志的方法                           | _array_   | `['console.log', 'console.table']` |
| shadowProjectMap      | 映射的项目                                            | _object_  | -                                  |
| transpileDependencies | 需要编译的第三方依赖                                  | _array_   | 参见下方                           |


### 常见问题


#### handleIfDefFiles

`handleIfDefFiles` 默认值如下：

```ts
/(press-ui|component|press-plus).*(\.vue|\.ts|\.js|\.css|\.scss)$/;
```


#### transpileDependencies

`transpileDependencies` 默认值如下：

```ts
['press-ui', 'press-plus', 'pmd-merchant-ui'];
```

#### console 日志

生产环境下，即`process.env.NODE_ENV`为`production`时，默认去掉`console`日志，可以通过`terserPureFuncs`传递空数组来恢复显示。

注意同时去掉`babel`插件`transform-remove-console`。


