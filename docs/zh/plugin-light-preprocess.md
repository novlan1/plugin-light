## 预处理器

条件编译的底层依赖。

### 如何使用

安装

```bash
pnpm add @plugin-light/preprocess -D
```

使用

```js
import { preprocessFile, preprocessFileSync, preprocess } from '@plugin-light/preprocess';

reprocess(content, context, {
  type,
});
```
