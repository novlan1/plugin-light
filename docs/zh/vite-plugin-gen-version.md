## 版本输出

输出当前版本，包括构建信息、最后一次提交信息。

可参考对应的 [webpack plugin](../plugin/gen-version.html)。

### 如何使用

安装

```bash
pnpm add vite-plugin-gen-version -D
```

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { 
  genVersionMpVitePlugin,
  genVersionWebVitePlugin,
 } from 'vite-plugin-gen-version';
import { BUILD_NAME_MAP } from 't-comm/lib/v-console/config';


const diffPlugins = [];
if (process.env.UNI_PLATFORM !== 'h5') {
  diffPlugins.push(genVersionMpVitePlugin());
} else {
  diffPlugins.push(genVersionWebVitePlugin({
    buildName: BUILD_NAME_MAP.build,
    commitName: BUILD_NAME_MAP.commit,
    delay: 0,
  }));
}


export default defineConfig({
  plugins: [
    ...diffPlugins,
  ],
});
```

### 参数

```ts
export type IGenVersionOptions = {
  // 传入 buildName 时，会将构建信息插入到 buildName 中
  buildName?: string;

  // 传入 commitName 时，会将最后一次提交信息插入到 commitName 中
  commitName?: string;

  // 延迟打印时间，单位 ms，默认 10
  delay?: number;
};
```
