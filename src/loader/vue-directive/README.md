# vue-direction


替换 Vue 模板中的指令，如：

```html
 <div
  v-treport="actshowcolumn.treport"
  class="tip-act-welfare-top"
  @click.stop="onClick"
>

<!-- 将转为 -->
 <div
  class="tip-act-welfare-top"
  @click.stop="onClick"
>
```

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const VUE_DIRECTIVE_LOADER = 'uni-plugin-light/lib/loader/vue-directive';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(VUE_DIRECTIVE_LOADER)
      .loader(VUE_DIRECTIVE_LOADER)
      .options({
        list: ['treport'],
      })
      .end();
  }
}
```

## loader参数

| 参数 | 说明             | 类型    | 默认值 |
| ---- | ---------------- | ------- | ------ |
| list | 待处理的指令列表 | _array_ | -      |
