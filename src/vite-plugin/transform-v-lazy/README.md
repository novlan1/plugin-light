# transform-v-lazy

转化 `v-lazy`，可参考对应的 [webpack loader](../loader/v-lazy.html)。


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { transformVLazyVitePlugin } from 'uni-plugin-light/lib/plugin';


export default defineConfig({
  plugins: [
    transformVLazyVitePlugin(),
  ],
});
```
