## 条件编译

实现了 `uni-app` 中的条件编译功能。

可参考对应的 [webpack loader](../loader/ifdef-loader.html)。

### 如何使用

安装

```bash
pnpm add vite-plugin-ifdef -D
```

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { ifdefVitePlugin } from 'vite-plugin-ifdef';


export default defineConfig({
  plugins: [
    ifdefVitePlugin({
      context: { H5: true, VUE3: true },
      type: ['css', 'js', 'html'],
    })
  ],
});
```

### 参数

同对应的 [webpack loader](../loader/ifdef-loader.html)。