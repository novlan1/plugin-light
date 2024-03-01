## 动态导入组件语法替换

将 `aComp(resolve){ require(['xx.vue'], resolve) }` 转为 `aComp: () => import('xx.vue')`。

### 如何使用

在 `vite.config.ts` 中添加如下设置：

```ts
import { defineConfig } from 'vite';
import { replaceRequireDynamicVitePlugin } from 'plugin-light/lib/plugin';


export default defineConfig({
  plugins: [
    replaceRequireDynamicVitePlugin(),
  ],
});
```
