## Rem 转换

转化 `rem` 到 `rpx`，可参考对应的 [webpack plugin](../plugin/rem-to-rpx.html)。


### 如何使用

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { remToRpxVitePlugin } from 'plugin-light/lib/plugin';


export default defineConfig({
  plugins: [
    remToRpxVitePlugin(),
  ],
});
```
