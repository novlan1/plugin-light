## JS 分发

可以将只有分包使用的`javascript/typescript`，移动到相应的分包内。

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-plugin-dispatch-script -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const { DispatchScriptPlugin } = require('@plugin-light/webpack-plugin-dispatch-script');

module.exports = {
  configureWebpack: {
    plugins: [
      new DispatchScriptPlugin()
    ],
  }
}
```

### 参数

```ts
export type IDispatchScriptOptions = {
  // 禁止移动的白名单列表
  whiteList?: Array<string>;

  // 是否增加 common/vendor 的引用
  addCommonVendorRequire?: boolean;
};
```

`whiteList` 只能是子节点，如果设置了非子节点，那么它引用的所有模块也要一同列举，否则会存在**父节点在主包、子节点在分包**，引用失败。可以类比成，**小兵随便挪地方，将军要走需要连他的手下一起挪走**。

### 日志

JS 分发是比较复杂的插件，执行时会在 `log` 目录下输出一些日志，下面是日志文件的说明。

| 文件名                                         | 说明                   |
| ---------------------------------------------- | ---------------------- |
| dispatch-script.inner-deps-flatten             | 依赖信息，已处理       |
| dispatch-script.inner-deps-raw                 | 依赖信息               |
| dispatch-script.inner-deps-to-dispatch-deep    | 将要派发的依赖         |
| dispatch-script.inner-main-package-pages       | 主包页面               |
| dispatch-script.raw-module-sources             | `module.resource` 列表 |
| dispatch-script.raw-resource-resolve-data-list | 原始引用关系           |
| dispatch-script.result-handled-modules         | 插件处理的模块         |

### 文章

[uni-app分包优化——JS分发](https://juejin.cn/post/7134873335301128229)

### 常见问题

如果遇到下面这样的报错，可以尝试传入 `addCommonVendorRequire` 为 `true`。

```
TypeError: Cannot read property 'call' of undefined
    at i (runtime.js?t=wechat&s=1718772395771&v=ca775494edc3431fdc68691e2e22246e:3)
    at Object.388b (act-goods-detail-barcode.js:1)
    at i (runtime.js?t=wechat&s=1718772395771&v=ca775494edc3431fdc68691e2e22246e:3)
    at Module.3591 (act-goods-detail-barcode.js:1)
    at i (runtime.js?t=wechat&s=1718772395771&v=ca775494edc3431fdc68691e2e22246e:3)
```

