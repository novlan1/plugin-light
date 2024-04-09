## 组件分发

可以将只有分包使用的`Vue`文件，移动到相应的分包内。

### 如何使用

在 `vue.config.js` 中添加如下设置：

```ts
const { DispatchVuePlugin } = require('plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new DispatchVuePlugin({
        moveComponents: {
          minUseTimes: 100,
          disableList: [
            '/common/widget/qrcode',
          ],
        },
      })
    ],
  }
}
```

### 参数

使用参数时要十分小心，当一个子组件被移动到分包中，所有引用了这个组件的其他组件都要跟着移动。

```ts
export type IDispatchVueOptions = {
  // 是否修复 npm 包，即使用 fix-npm-package 插件
  useFixNpm?: boolean;
  // 是否插入 vendor 的引用
  insertRequireVendor?: boolean;

  // 是否需要日志，默认 false
  needLog?: boolean;
  // 是否仅返回全局组件，默认 false
  needGlobalComponents?: boolean;

  moveComponents?: {
    // 最大分包使用数目，超过这个值后不会移动，默认 10000000
    minUseTimes: number;
    // 禁止移动的组件列表
    disableList: Array<string>;
  },
};
```


### 文章

[uni-app分包优化——组件分发](https://juejin.cn/post/7134873157449547812)
