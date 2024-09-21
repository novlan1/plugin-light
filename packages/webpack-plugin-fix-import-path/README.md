## 修复引用路径错误

对于 `common/runtime.js`、`common/vendor.js` 等文件，打包产物的引用路径可能会发生异常，本插件会根据真实的文件路径来修复。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-fix-import-path -D
```

在 `vue.config.js` 中添加如下设置：


```ts
const { FixImportPathPlugin } = require('@plugin-light/webpack-plugin-fix-import-path');


module.exports = {
  configureWebpack: {
    plugins: [
      new FixImportPathPlugin({
        handleList: [
          'common/vendor.js',
          'common/runtime.js',
          'common/main.js',
        ],
        pluginName: 'pluginA',
      })
    ]
  }
}
```

### 参数

```ts
export interface IFixImportPathOptions {
  // 待处理的文件列表
  handleList?: Array<string>;
  // 插件名称
  pluginName?: string;
}
```

`handleList` 默认值

```ts
const HANDLE_LIST = [
  'common/vendor.js',
  'common/runtime.js',
  'common/main.js',
];
```
