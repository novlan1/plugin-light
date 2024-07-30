## 三方库别名处理

一些三方库是以源码方式提供的，比如 `press-plus`，`Vue2.x` 时可以配置 `transpileDependencies`，但是 `Vite` 没有对应的配置项。

可以这么处理：

1. 将三方库复制到 `src` 下的某个目录下
2. 为三方库配置 `alias`，指向 `src` 某目录下
3. 配置 `tsconfig.json` 的 `compileOptions.paths`

本插件做的就是上面的第一步。

### 如何使用

在 `vite.config.ts` 中添加如下设置：


```ts
import { defineConfig } from 'vite';
import { aliasForLibrary } from 'plugin-light/lib/plugin';


export default defineConfig({
  plugins: [
    aliasForLibrary({
      list: [
        'press-ui',
        'press-plus',
      ],
      target: 'src/library',
    }),
  ],
});
```

### 参数

```ts
export type IAliasForLibraryOptions = {
  // 三方库列表
  list?: Array<string>;
  // alias 目标
  target?: string;
  // 执行路径
  root?: string;
};
```

### 其他

设置 `alias` 示例：

```ts
export default defineConfig({
  resolve: {
    alias: {
      'press-ui': path.resolve(__dirname, 'src/library/press-ui')
    }
  },
})
```
