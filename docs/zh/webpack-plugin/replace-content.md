## 打包内容转换

替换打包产物内容

### 如何使用

在 `vue.config.js` 中添加如下设置：


```ts
const { ReplaceContentPlugin } = require('plugin-light/lib/plugin');

const plugins = []

plugins.push(
  new ReplaceContentPlugin({
    replaceList: [
      {
        from: new RegExp('background-image:\\s?url\\(https://cdn\\.dcloud\\.net\\.cn/img\\/.*?.png\\);?'),
        to: '',
        files: [/\.(css|scss|less|wxss)$/],
      },
    ],
  })
)

module.exports = {
  configureWebpack: {
    plugins,
  }
}
```

### 参数

```ts
export type IReplaceList = Array<{
  // 要替换的内容
  from: string | RegExp;
  // 要替换成的目标内容
  to: string;
  // 要处理的文件列表
  files?: Array<string | RegExp>;
}>;

export type IReplaceContentOptions = {
  replaceList: IReplaceList;
};
```
