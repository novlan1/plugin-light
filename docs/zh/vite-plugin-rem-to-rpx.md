## Rem 转换

转化 `rem` 到 `rpx`，可参考对应的 [webpack plugin](../plugin/rem-to-rpx.html)。


### 如何使用

安装

```bash
pnpm add @plugin-light/vite-plugin-rem-to-rpx -D
```

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { remToRpxVitePlugin } from '@plugin-light/vite-plugin-rem-to-rpx';


export default defineConfig({
  plugins: [
    remToRpxVitePlugin(),
  ],
});
```
