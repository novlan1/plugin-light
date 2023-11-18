# inject-dynamic-style-mp

注入不同类型的样式文件，小程序可用。

与 `inject-dynamic-style-web` 类似，只是前者可在 `body` 上添加样式，而本 `loader` 必须挂载在页面内部结构中。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const INJECT_DYNAMIC_STYLE_MP = 'uni-plugin-light/lib/loader/inject-dynamic-style-mp';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('inject-dynamic-style-mp')
      .test(/(\.vue)$/)
      .use(INJECT_DYNAMIC_STYLE_MP) 
      .loader(INJECT_DYNAMIC_STYLE_MP)
      .options({
        topElement: 'demo-wrap'
      })
      .end();
  }
}
```

## loader 参数

| 参数       | 说明       | 类型              | 默认值                   |
| ---------- | ---------- | ----------------- | ------------------------ |
| topElement | 顶层元素   | _string_          | body                     |
| platforms  | 处理的平台 | _Array\<string\>_ | `['mp-weixin', 'mp-qq']` |

