## 三方库转换

替换一些小程序用不到的库，避免产物体积过大。

## 使用方法

在 `vue.config.js` 中添加如下设置：

```ts
const { LOADER: replaceLibrary } = require('webpack-loader-replace-library')';

const defaultReplaceLibConfig = {
  replaceLibraryList: [
    {
      from: 'vant',
      to: 'src/common/tools/fake-library/vant/index.js',
      exact: false,
    },
    {
      from: 'tim-js-sdk',
      to: 'src/common/tools/fake-library/tim-js-sdk/index.js',
      exact: false,
    },
    {
      from: 'nes-tim',
      to: 'src/common/tools/fake-library/nes-tim/index.js',
      exact: false,
    },
    {
      from: 'swiper',
      to: 'src/common/tools/fake-library/vant/index.js',
      exact: false,
    },
    {
      from: 'lodash-es',
      to: 'src/common/tools/fake-library/vant/index.js',
      exact: false,
    },
  ],
  replaceContentList: [{
    path: 'src/common/network/request/*',
    content() {
      return '';
    },
  }, {
    path: 'src/common/tools/debug/index.js',
    content() {
      return '';
    },
  },
  ],
};

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use(replaceLibrary)
      .loader(replaceLibrary)
      .options(defaultReplaceLibConfig)
      .end();
  },
};
```

### 参数

```ts
export type IReplaceLibraryOptions = {
  // 替换引用路径列表
  replaceLibraryList?: Array<{
    // 源地址
    from: string;
    // 目标地址
    to: string;
    // 是否精确查找, 默认false
    exact?: boolean
  }>;

  // 替换文件内容列表
  replaceContentList?: Array<{
    // 源地址
    path: string;
    // 文件内容
    content: Function | string;
  }>
};
```
