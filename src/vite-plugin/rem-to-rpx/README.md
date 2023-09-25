# rem-to-rpx

转化 `rem` 到 `rpx`，可参考对应的 [webpack plugin](../plugin/rem-to-rpx.html)。


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { remToRpxVitePlugin } from 'uni-plugin-light/lib/plugin';


export default defineConfig({
  plugins: [
    remToRpxVitePlugin(),
  ],
});
```
