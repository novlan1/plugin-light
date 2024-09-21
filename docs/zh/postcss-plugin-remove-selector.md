## 移除选择器

安装

```bash
pnpm add @plugin-light/postcss-plugin-remove-selector -D
```

`postcss.config.js` 中新增配置：

```ts
module.exports = {
  require('@plugin-light/postcss-plugin-remove-selector/lib/index')({
    list: [{
      file: new RegExp('press-ui/press-icon-plus/css/icon.scss'),
      excludes: {
        not: [
          'arrow',
          'arrow-left',
          'arrow-right',
          'arrow-up',
          'arrow-down',
          'success',
          'cross',
          'plus',
          'minus',
          'fail',
          'circle',
        ].map(item => `.press-icon-plus-${item}:before`),
      },
    }],
  }),
}
```
