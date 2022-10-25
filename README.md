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
  DispatchVuePlugin,
  GenVersionMpPlugin,
  GenVersionWebPlugin,
  TransferLocalFilePlugin,
} = require('uni-plugin-light/lib/plugin');

let plugins = []

plugins.push(new GenVersionMpPlugin());

if (process.env.NODE_ENV === 'production') {
  // js分发
  plugins.push(new DispatchScriptPlugin());
  // 组件分发
  plugins.push(new DispatchVuePlugin(getProjectConfig('bundleOptimize')));
}

module.exports = {
  configureWebpack: {
    plugins,
  }
}
```



## loader使用方法

```js
// vue.config.js

const INSET_GLOBAL_COMP_LOADER = 'uni-plugin-light/lib/loader/insert-global-comp';
const TRANSFORM_DYNAMIC_COMP_LOADER = 'uni-plugin-light/lib/loader/transform-dynamic-comp';
const REPLACE_VUE_KEY_LOADER = 'uni-plugin-light/lib/loader/replace-vue-key';
const REPLACE_LIBRARY_LOADER = 'uni-plugin-light/lib/loader/replace-library';
const V_LAZY_LOADER = 'uni-plugin-light/lib/loader/v-lazy';

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
  
   config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(TRANSFORM_DYNAMIC_COMP_LOADER)
      .loader(TRANSFORM_DYNAMIC_COMP_LOADER)
      .end()
      .use(REPLACE_VUE_KEY_LOADER)
      .loader(REPLACE_VUE_KEY_LOADER)
      .end()
      .use(REPLACE_LIBRARY_LOADER)
      .loader(REPLACE_LIBRARY_LOADER)
      .options(defaultReplaceLibConfig)
      .end()
      .use(V_LAZY_LOADER)
      .loader(V_LAZY_LOADER)
      .options({
        urlHandler: 'getCompressImgUrl',
      })
      .end()
  }
}
```

## 如何发布本工具


```bash
$ npm run release
```

