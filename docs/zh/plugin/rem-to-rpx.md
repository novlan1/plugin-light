## Rem 转换

将`rem`转为`rpx`插件。

### 如何使用

在 `vue.config.js` 中添加如下设置：

```ts
const { RemToRpxPlugin } = require('plugin-light/lib/plugin');


module.exports = {
  configureWebpack: {
    plugins: [
      new RemToRpxPlugin({
        whiteList: []
      })
    ],
  }
}
```

### 参数

```ts
export type IRemToRpxOptions = {
  // 不处理的路径白名单列表
  whiteList?: Array<string>;
  // 转换比例，默认 100
  factor?: number;
  // 目标单位，默认 rpx
  unit?: string;
  // 要处理的文件后缀名，默认 ['css', 'scss', 'less', 'wxss', 'qss', 'jxss']
  fileSuffix?: Array<string>;
};
```
