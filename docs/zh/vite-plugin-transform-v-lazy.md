## Vue v-lazy 转换

转化 `v-lazy`，可参考对应的 [webpack loader](../loader/v-lazy.html)。


### 如何使用

安装

```bash
pnpm add @plugin-light/vite-plugin-transform-v-lazy -D
```

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { transformVLazyVitePlugin } from '@plugin-light/vite-plugin-transform-v-lazy';


export default defineConfig({
  plugins: [
    transformVLazyVitePlugin(),
  ],
});
```
