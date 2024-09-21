## 公共包

除 `t-comm` 外，`plugin-light` 中最底层的依赖，业务无需使用。

### 如何使用

安装

```bash
pnpm add plugin-light-shared -D
```

使用

```js
import { getDeps } from 'plugin-light-shared';

getDeps(__dirname);
```
