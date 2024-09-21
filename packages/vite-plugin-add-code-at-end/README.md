## 文件后增加代码

使用场景包括给文件增加额外的导出，比如为 Vue3 增加默认导出。

### 如何使用

安装

```bash
pnpm add @plugin-light/vite-plugin-add-code-at-end -D
```

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { addCodeAtEndVitePlugin } from '@plugin-light/vite-plugin-add-code-at-end';


export default defineConfig({
  plugins: [
    addCodeAtEndVitePlugin({
      list: [
        {
          id: 'vue.js',
          code: 'export default function(){}',
          exact: false,
        },
        {
          id: 'vue.runtime.esm-bundler.js',
          code: 'export default function(){}',
          exact: false,
          number: 1,
        },
      ],
    }),
  ],
});
```

### 参数

```ts
export type IAddCodeAtEndItem = {
  // 文件名，或文件名关键字
  id: string;
  // 要添加的代码
  code: string;
  // 是否精确匹配文件
  exact?: boolean;
  // 要匹配的文件数据，设置为 1 时，可防止重复添加
  number?: number;
};

export type IAddCodeAtEndOptions = {
  list?: Array<IAddCodeAtEndItem>;
};
```
