## Uni App Vite 项目基础配置

封装 `vite.config.ts` 的基本配置，开箱即用。

### 如何使用

安装

```bash
pnpm add @plugin-light/project-config-uni-vite -D
```

在 `vite.config.ts` 中添加如下设置：


```js
import { getUniVue3ViteConfig } from '@plugin-light/project-config-uni-vite';

import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return getUniVue3ViteConfig({ mode });
});
```

### 参数

```ts
import type { Plugin } from 'vite';


export interface IUniViteConfigOptions {
  mode: string;
  uni: any;

  // 端口，传递给 server.port
  port?: number;
  // https 配置，传递给 server.https
  https?: Record<string, any>;
  // host 配置，传递给 server.host
  host?: boolean;

  // 前置插件
  prePlugins?: Array<Plugin>;
  // 后置插件
  postPlugins?: Array<Plugin>;
}
```

### 注意事项

1. node.js 版本 >= 16

2. 支持在环境变量文件中配置 `VUE_APP_DIR`，环境变量文件可以是 `.env`, `.env.local` 等，举例如下：

```
UNI_INPUT_DIR = './src/project/guandan-match'
VUE_APP_DIR = project/guandan-match
```
