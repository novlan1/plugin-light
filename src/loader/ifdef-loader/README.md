# ifdef loader


此 `loader` 实现了 `uni-app` 中的条件编译功能，可以帮助在普通 h5 项目中运行 `uni-app` 的跨端项目。


## 条件编译

`uni-app` 中的条件编译文档在[这里](https://uniapp.dcloud.net.cn/tutorial/platform.html#preprocessor)，`ifdef-loader` 是参考其实现的，所以开发者在代码中使用条件编译时，可以和 `uni-app` 完全一致。


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const IF_DEF_LOADER = 'uni-plugin-light/lib/loader/ifdef-loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('ifdef-loader')
      // 根据项目实际配置文件类型
      .test(/press-ui.*(\.vue|\.ts|\.js|\.css|\.scss)$/)
      // 不要配成下面这样，会卡住
      // .test(/\.vue|\.ts|\.js|\.css|\.scss$/) 
      .use(IF_DEF_LOADER)
      .loader(IF_DEF_LOADER)
      .options({
        context: { H5: true },
        type: ['css', 'js', 'html'],
      })
      .end();
  }
}
```

## loader参数

| 参数    | 说明           | 类型              | 默认值  |
| ------- | -------------- | ----------------- | ------- |
| context | 上下文         | _object_          | -       |
| type    | 处理的文件类型 | _Array\<string\>_ | -       |
| log     | 是否打印日志   | _boolean_         | `false` |
