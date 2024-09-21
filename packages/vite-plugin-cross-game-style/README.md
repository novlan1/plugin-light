## 样式关键词编译

`scss` 链接的关键词编译，替换关键词 `@TIP_STYLE_NAME`。

可参考对应的 [Webpack Loader](../loader/cross-game-style.html)。


### 如何使用

安装

```bash
pnpm add @plugin-light/vite-plugin-cross-game-style -D
```

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { crossGameStyleVitePlugin } from '@plugin-light/vite-plugin-cross-game-style';


export default defineConfig({
  plugins: [
    crossGameStyleVitePlugin({
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
