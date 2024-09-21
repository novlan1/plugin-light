## CSS 中 URL 前空格修复

`css` 中 `url` 前加空格，比如：

```scss
// before
format("woff2"),url(https://at.alicdn.com/t/font_2553510_5imfhdc20ag.woff?t=1640074908811)

// after
format("woff2"), url(https://at.alicdn.com/t/font_2553510_5imfhdc20ag.woff?t=1640074908811)
```


### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-css-url-blank-space -D
```

在 `vue.config.js` 中配置如下：

```js
const { LOADER: cssUrlBlankSpace } = require('webpack-loader-css-url-blank-space')';

module.export = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(css)$/,
          use: [cssUrlBlankSpace],
        },
      ],
    },
  }
}
```
