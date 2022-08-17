# uni-plugin-light

## 安装
```
npm install -D uni-plugin-light
```


### 所有插件使用方式
```
// vue.config.js中直接引入
var uniPluginLight = require('uni-plugin-light');
module.exports = {
    chainWebpack: config => {
        uniPluginLight(config)
    },
}
```

### 使用单个插件

```
// vue.config.js中直接引入
const TransferVuePlugin = require('uni-plugin-light/plugin/transfer-vue-plugin');
plugins.push(new TransferVuePlugin());
module.exports = {
  plugins
}
```
