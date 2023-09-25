# 组件分发插件

可以将只有分包使用的`Vue`文件，移动到相应的分包内。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```ts
const {
  DispatchVuePlugin,
} = require('uni-plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new DispatchVuePlugin({
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

