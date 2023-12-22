## 动态样式注入 - 小程序

注入不同类型的样式文件，小程序可用。

与 `inject-dynamic-style-web` 类似，只是前者可在 `body` 上添加样式，而本 `loader` 必须挂载在页面内部结构中。

### 如何使用

在 `vue.config.js` 中配置如下：

```js
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('inject-dynamic-style-mp')
      .test(/(\.vue)$/)
      .use(LOADER_MAP.injectDynamicStyleMp) 
      .loader(LOADER_MAP.injectDynamicStyleMp)
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

