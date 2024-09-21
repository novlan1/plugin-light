## Vite 项目基础配置

封装 `vite.config.ts` 的基本配置，开箱即用。

### 如何使用

安装

```bash
pnpm add @plugin-light/project-config-vite -D
```

在 `vite.config.ts` 中添加如下设置：


```js
import { getViteBaseConfig } from "@plugin-light/project-config-vite";

import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return getViteBaseConfig({ mode });
});
```

### 参数

```ts
import type { IAddCodeAtEndOptions } from '../../vite-plugin/add-code-at-end/types';
import type { IAliasForLibraryOptions } from '../../vite-plugin/alias-for-library/types';

type GetViteConfigOptions = {
  // 模式，对应 Vite 中 defineConfig 的 mode 参数
  mode: string;

  // 本地开发端口
  serverPort?: number;
  // 本地开发是否是 https
  serverHttps?: boolean;
  // 参考 https://cn.vitejs.dev/config/server-options.html#server-host
  serverHost?: string | boolean;

  // 对应 optimizeDeps.include
  optimizeDepsIncludes?: Array<string>;
  // 对应 optimizeDeps.exclude
  optimizeDepsExcludes?: Array<string>;

  // add-code-at-end 插件参数
  addCodeAtEndOptions?: IAddCodeAtEndOptions;

  // 是否使用 press-ui 本地的 alias 配置
  pressUiAlias?: string;
  pressPlusAlias?: string;

  // alias-for-library 插件参数
  aliasForLibraryOptions?: IAliasForLibraryOptions;

  // pmd-tools 之类的别名映射
  pmdAliasMap?: Record<string, string>;

  customElements?: Array<string>;

  // 三方库是否使用 cdn 链接，比如 vue，vue-router
  useCdn?: boolean;
};
```

### 注意事项

1. node.js 版本 >= 16

2. 支持在环境变量文件中配置 `VUE_APP_DIR`，环境变量文件可以是 `.env`, `.env.local` 等

    也支持不配置，此时应用入口是 `src/main.ts`，即非 `monorepo` 模式

### 打包产物分析

当 `process.env.VITE_VISUALIZER` 不为 `falsy` 时，本工具会使用 `rollup-plugin-visualizer` 插件，开发者可用来进行打包分析。


