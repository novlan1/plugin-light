## 组件分发

可以将只有分包使用的`Vue`文件，移动到相应的分包内。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-dispatch-vue -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { DispatchVuePlugin } = require('@plugin-light/webpack-plugin-dispatch-vue');

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

### 日志

组件分发是比较复杂的插件，执行时会在 `log` 目录下输出一些日志，下面是日志文件的说明。

| 文件名                                       | 说明                                 |
| -------------------------------------------- | ------------------------------------ |
| dispatch-vue.inner-global-components-all     | 所有全局组件，包含递归引用的         |
| dispatch-vue.inner-using-component-flatten   | 组件引用关系，已拉平                 |
| dispatch-vue.inner-using-component-map       | 组件引用关系，未拉平                 |
| dispatch-vue.inner-using-component-pages     | 组件引用关系，已拉平，`value` 是页面 |
| dispatch-vue.raw-get-component-set           | 原始值，`getComponentSet()`          |
| dispatch-vue.raw-get-global-using-components | 原始值，`getGlobalUsingComponents()` |
| dispatch-vue.raw-get-json-file               | 原始值，`getJsonFile()`              |
| dispatch-vue.raw-get-wx-components           | 原始值，`getWXComponents()`          |
| dispatch-vue.raw-json-file-map               | 原始值，`getJsonFileMap()`           |
| dispatch-vue.raw-output-dir                  | 原始值，`process.env.UNI_OUTPUT_DIR` |
| dispatch-vue.raw-UNI_SUBPACKAGES             | 原始值，`process.UNI_SUBPACKAGES`    |
| dispatch-vue.result-moving-components        | 移动关系                             |
| dispatch-vue.result-replace-ref-list         | 替换引用关系                         |


### 文章

[uni-app分包优化——组件分发](https://juejin.cn/post/7134873157449547812)
