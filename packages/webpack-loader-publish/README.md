## 本地发布

可以在 `nodejs` 或 `bash` 中使用。

## 如何使用

安装

```bash
pnpm add @plugin-light/webpack-loader-publish -D
```

在 `nodejs` 中使用

```ts
const { LOADER: publishUtil } = require('@plugin-light/webpack-loader-publish')';

node publishUtil [prod|test]
```

在 `bash` 中使用

```bash
# 工具暴露 light-cli 命令
npx light-cli publish `[prod|test]`
```

### 默认值

```ts
export const DEFAULT_PUBLISH_OPTIONS = {
  port: '3005',
  method: 'POST',
  path: '/web-publish/publish',
} as const;
```


### 环境变量

- VUE_APP_LOCAL_PUBLISH_HOST，对应 `host`
- VUE_APP_LOCAL_PUBLISH_PORT，对应 `port`
- VUE_APP_LOCAL_PUBLISH_METHOD，对应 `method`
- VUE_APP_LOCAL_PUBLISH_PATH，对应 `path`
