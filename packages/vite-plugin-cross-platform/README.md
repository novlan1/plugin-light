## 跨平台关键词编译

跨平台的关键词编译，替换关键词 `@TIP_PLATFORM_NAME`。

可参考对应的 [Webpack Loader](../loader/cross-platform.html)。


### 如何使用

安装

```bash
pnpm add vite-plugin-cross-platform -D
```

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { crossPlatformVitePlugin } from 'vite-plugin-cross-platform';


export default defineConfig({
  plugins: [
    crossPlatformVitePlugin({
      platform: 'web'
    }),
  ],
});
```


### 参数

```ts
export type ICrossPlatformOptions = {
  // 平台名称，默认 web
  platform?: string;
};
```
