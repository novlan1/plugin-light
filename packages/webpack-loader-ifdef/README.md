## 条件编译


此 `loader` 实现了 `uni-app` 中的条件编译功能，可以帮助在普通 h5 项目中运行 `uni-app` 的跨端项目。


## 条件编译

`uni-app` 中的条件编译文档在[这里](https://uniapp.dcloud.net.cn/tutorial/platform.html#preprocessor)，`ifdef-loader` 是参考其实现的，所以开发者在代码中使用条件编译时，可以和 `uni-app` 完全一致。


### 如何使用

安装

```bash
pnpm add webpack-loader-ifdef -D
```

在 `vue.config.js` 中配置如下：

```js
const { LOADER as ifdef } = require('webpack-loader-ifdef')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('ifdef-loader')
      // 根据项目实际配置文件类型
      .test(/press-ui.*(\.vue|\.ts|\.js|\.css|\.scss)$/)
      // 不要配成下面这样，会卡住
      // .test(/\.vue|\.ts|\.js|\.css|\.scss$/) 
      .use(ifdef)
      .loader(ifdef)
      .options({
        context: { H5: true },
        type: ['css', 'js', 'html'],
      })
      .end();
  }
}
```

### 参数

```ts
export type IIfdefOptions = {
  // 上下文，比如 { H5: true }
  context?: Record<string, boolean>;

  // 是否打印日志, 默认 false
  log?: boolean;

  // 处理的文件类型，可选值为 'css', 'js', 'html'
  type: Array<string>;
};
```
