## 打包后外层文件转移

转移打包后的外层文件。

对于下面的项目目录结构：

```
- src
  - common
  - components
  - project
    - user
      - main.js
    - admin
      - main.js
```

`common/components`等文件夹打包后并不会放到`dist/build/mp-weixin`中，而是打包到了`dist/build`中，本插件可以修复这一问题，将`common`等文件夹移动到`dist/build/mp-weixin`中。




### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-transfer-local-file -D
```

在 `vue.config.js` 中添加如下设置：


```ts
const { TransferLocalFilePlugin } = require('@plugin-light/webpack-plugin-transfer-local-file');


module.exports = {
  configureWebpack: {
    plugins: [
      new TransferLocalFilePlugin({
        adapterDirs: [
          'comm',
          'common',
          'component',
        ],
        isModifyRef: true,
      })
    ]
  }
}
```

### 参数

```ts
export type ITransferLocalFileOptions= {
  // 是否修改打包产物中的引用位置，默认 false
  isModifyRef?: boolean;
  // 处理的文件夹列表
  adapterDirs?: Array<string>;
};

```

### 常见问题

下面几个文件是 uni-app 编译后的文件，不要使用下面的名字：

```ts
const IGNORE_FILE_LIST = ['common/vendor.js', 'common/runtime.js', 'common/main.js'];
```
