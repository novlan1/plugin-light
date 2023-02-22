# uni-plugin-light

## 安装
```
npm install -D uni-plugin-light
```


## 插件使用方式

```js
// vue.config.js

const {
  DispatchScriptPlugin,
} = require('uni-plugin-light/lib/plugin');

let plugins = []

if (process.env.NODE_ENV === 'production') {
  // js分发
  plugins.push(new DispatchScriptPlugin());
}

module.exports = {
  configureWebpack: {
    plugins,
  }
}
```



## loader 使用方法

```js
// vue.config.js

const INSET_GLOBAL_COMP_LOADER = 'uni-plugin-light/lib/loader/insert-global-comp';

module.exports = {
  chainWebpack(config) {
    config.module
    .rule('global-comp-vue')
    .test(/\.vue$/)
    .pre()
    .use(INSET_GLOBAL_COMP_LOADER)
    .loader(INSET_GLOBAL_COMP_LOADER)
    .options({
      pages: getPagePath(),
      components: getProjectConfig('injectComponents'),
    })
    .end();
  }
}
```

