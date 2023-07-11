# uni-plugin-light


uni-app相关插件，包括

- 依赖分析
- JS分发
- 组件分发
- npm包打包失败修复
- 生成版本号
- rem转rpx
- 内容替换
- 拷贝本地文件


以及一些loader

- 自定义ifdef
- 插入全局组件
- 替换三方库
- v-lazy兼容
- 替换动态组件
- 替换vue标签
- 替换v-for中的key


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

