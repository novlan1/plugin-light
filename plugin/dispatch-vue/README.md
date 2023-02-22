# 组件分发插件

可以将只有分包只有的`Vue`文件移动到相应的分包内。

## 使用方式

在`vue.config.js`中进行如下配置：

```ts
const {
  DispatchVuePlugin,
} = require('uni-plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      DispatchVuePlugin({
        minUseTimes: 100,
        disableList: [
          '/common/widget/qrcode',
        ],
      })
    ],
  }
}
```

## 插件参数

| 参数        | 说明                                   | 类型              | 默认值 |
| ----------- | -------------------------------------- | ----------------- | ------ |
| minUseTimes | 最大分包使用数目，超过这个值后不会移动 | _number_          | `100`  |
| disableList | 禁止移动的组件列表                     | _Array\<string\>_ | -      |

使用参数时要十分小心，当一个子组件被移动到分包中，所有引用了这个组件的其他组件都要跟着移动。


## 文章

[uni-app分包优化——组件分发](https://juejin.cn/post/7134873157449547812)

