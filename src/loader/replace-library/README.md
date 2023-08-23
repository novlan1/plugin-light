# replace-library

替换一些小程序用不到的库，避免产物体积过大。

## 使用方法

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```ts
const REPLACE_LIBRARY_LOADER = 'uni-plugin-light/lib/loader/replace-library';

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
      .use(REPLACE_LIBRARY_LOADER)
      .loader(REPLACE_LIBRARY_LOADER)
      .options(defaultReplaceLibConfig)
      .end();
  },
};
```

## loader参数

| 参数               | 说明             | 类型               | 默认值 |
| ------------------ | ---------------- | ------------------ | ------ |
| replaceLibraryList | 替换引用路径列表 | _Array\<Library\>_ | -      |
| replaceContentList | 替换文件内容列表 | _Array\<Content\>_ | -      |

Library

| 参数  | 说明         | 类型      | 默认值 |
| ----- | ------------ | --------- | ------ |
| from  | 源地址       | _string_  | -      |
| to    | 目标地址     | _string_  | -      |
| exact | 是否精确查找 | _boolean_ | false  |

Content

| 参数    | 说明     | 类型       | 默认值 |
| ------- | -------- | ---------- | ------ |
| path    | 源地址   | _string_   | -      |
| content | 文件内容 | _function_ | -      |

