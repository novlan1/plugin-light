## 转换 Web 标签

安装

```bash
pnpm add @plugin-light/postcss-plugin-transform-web-tag -D
```

`vite.config.ts` 中新增配置：

```ts
import transformWebTag from '@plugin-light/postcss-plugin-transform-web-tag/lib/index';

export default {
  // ...
   css: {
    postcss: {
      plugins: [transformWebTag({
        tagMap: {
          span: 'label',
          img: 'image',
          i: 'view',
          p: 'view',
          h4: 'view',
          em: 'view',
          ul: 'view',
          li: 'view',
        }
      })],
    },
  },
  //...
}
```


### 默认的 tagMap

```ts
const TAG_MAP = {
  span: 'label',
  img: 'image',
  i: 'view',
  p: 'view',
  h4: 'view',
  em: 'view',
  ul: 'view',
  li: 'view',
};
```
