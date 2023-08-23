# replace-content


替换打包产物内容

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：


```ts
const {
  ReplaceContentPlugin,
} = require('uni-plugin-light/lib/plugin');

const plugins = []

plugins.push(
  new ReplaceContentPlugin({
    replaceReg: new RegExp('background-image:\\s?url\\(https://cdn\\.dcloud\\.net\\.cn/img\\/.*?.png\\);?'),
    fileNameReg: /\.(css|scss|less|wxss)$/
  })
)

module.exports = {
  configureWebpack: {
    plugins,
  }
}
```

