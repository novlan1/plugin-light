# transfer-local-file

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




## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：


```ts
const {
  TransferLocalFilePlugin,
} = require('uni-plugin-light/lib/plugin');


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

## 插件参数


| 参数        | 说明                         | 类型      | 默认值  |
| ----------- | ---------------------------- | --------- | ------- |
| adapterDirs | 处理的文件夹列表             | _array_   | -       |
| isModifyRef | 是否修改打包产物中的引用位置 | _boolean_ | `false` |

