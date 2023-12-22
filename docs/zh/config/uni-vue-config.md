## uni-app 项目基础配置

`Vue.config.js` 配置，适用于 uni-app 项目。

### 如何使用

在 `vue.config.js` 中添加如下设置：


```js
const { getUniVueConfig } = require('plugin-light/lib/uni-vue-config');
const { merge } = require('webpack-merge');

module.exports = merge(getUniVueConfig(), {});
```

### getWebpackBaseConfig 参数

`getWebpackBaseConfig` 接收一个对象作为参数，其属性及说明如下：


| 参数                  | 说明                                          | 类型    | 默认值   |
| --------------------- | --------------------------------------------- | ------- | -------- |
| transpileDependencies | 需要编译的第三方依赖                          | _array_ | 参见下方 |
| adapterDirs           | `transfer-local-file loader` 需要处理的文件夹 | _array_ | 参见下方 |


### 常见问题


#### transpileDependencies

`transpileDependencies` 默认值如下：

```ts
['press-ui', 'press-plus', 'pmd-merchant-ui'];
```

#### adapterDirs

`adapterDirs` 默认值如下：

```ts
[
  'comm',
  'common',
  'component',
  'live-component',
  'logic',
  'local-logic',
  'local-component',
  'login',
  'pages',
  'static',
  'node-modules',
]
```

