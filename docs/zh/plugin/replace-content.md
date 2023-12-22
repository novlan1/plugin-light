## 打包内容转换

替换打包产物内容

### 如何使用

在 `vue.config.js` 中添加如下设置：


```ts
const { ReplaceContentPlugin } = require('plugin-light/lib/plugin');

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

