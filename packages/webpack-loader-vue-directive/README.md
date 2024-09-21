## Vue 指令转换


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

### 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-vue-directive -D
```

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER as vueDirective } = require('webpack-loader-vue-directive')';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(vueDirective)
      .loader(vueDirective)
      .options({
        list: ['treport'],
      })
      .end();
  }
}
```

### 参数

```ts
export type IVueDirectionOptions = {
  // 待处理的指令列表
  list?: Array<string>;
};
```
