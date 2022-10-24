# uni-plugin-light

## 安装
```
npm install -D uni-plugin-light
```


### 所有插件使用方式

```js
// vue.config.js中直接引入
var uniPluginLight = require('uni-plugin-light/plugin');
module.exports = {
    chainWebpack: config => {
        uniPluginLight(config)
    },
}
```

### 使用单个插件

```js
// vue.config.js中直接引入
const TransferVuePlugin = require('uni-plugin-light/plugin/transfer-vue-plugin');
plugins.push(new TransferVuePlugin());
module.exports = {
  plugins
}
```

## 如何发布本工具


1. 执行`npm run release`
2. 注意是内部源！