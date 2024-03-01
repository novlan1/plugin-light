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

在 `vue.config.js` 中添加如下设置：

```js
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.vueDirective)
      .loader(LOADER_MAP.vueDirective)
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
