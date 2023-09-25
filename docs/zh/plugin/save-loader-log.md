# save-loader-log

将`loader`中的日志，输出到本地文件。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```


2. 在你的`loader`中使用`recordLoaderLog`记录日志。


```ts
const {
  recordLoaderLog,
} = require('uni-plugin-light/lib/plugin');


function someLoader(source) {
  recordLoaderLog('replace-library.json', {
    a: 'xxx',
  });
}
```


3. 在 `vue.config.js` 中添加如下设置：


```ts
const {
  SaveLoaderLogPlugin,
} = require('uni-plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new SaveLoaderLogPlugin()
    ]
  }
}
```

