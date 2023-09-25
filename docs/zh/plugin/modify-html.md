# 修改HTML插件

可以修改构建后的html，插入一些内容。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```ts
const {
  HtmlModifyPlugin,
} = require('uni-plugin-light/lib/plugin');


module.exports = {
  chainWebpack(config) {
    config.plugin('HtmlModify')
      .use(new HtmlModifyPlugin({
        onEnd: {
          html: [{
            source: path.resolve(curDirname, 'src', getRealVueAppDir(), 'index.html'),
            destination: `${getOutputPath()}/index.html`,
            ssr: process.env.VUE_APP_SSR,
            urls: getCdnInject({ isVue3 }).cdnUrls,
          }],
        },
      }))
      .tap(args => args);
  }
}
```
