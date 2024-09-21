## 版本输出

输出当前版本，包括构建信息、最后一次提交信息。

### 如何使用

安装

```bash
pnpm add webpack-plugin-gen-version -D
```

在 `vue.config.js` 中添加如下设置：

```ts
const {
  GenVersionWebPlugin,
  GenVersionMpPlugin,
} = require('webpack-plugin-gen-version');

const plugins = []

if (process.env.VUE_APP_PLATFORM !== 'h5') {
  plugins.push(new GenVersionMpPlugin());
} else {
  plugins.push(new GenVersionWebPlugin());
}

module.exports = {
  configureWebpack: {
    plugins,
  }
}
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

对于`web`端的插件 `GenVersionWebPlugin`，可以选择通过`console.log`输出，或者插入到`window`的一个属性中。挂载在`window`中相对隐蔽，不容易泄漏开发相关信息。

默认输出示例：

```html
<script>
try {
  setTimeout(() => {   
    console.info('[system]', '');
    console.info('[system]', 'Build Time: 2023-08-21 10:10:35');
    console.info('[system]', 'Build Author: xx');
    console.info('[system]', 'Build Branch: release');
    console.info('[system]', 'Build Net Env: ');
        
    console.info('[system]', '');
    console.info('[system]', 'Last Commit Message: xx');
    console.info('[system]', 'Last Commit Author: xx');
    console.info('[system]', 'Last Commit Time: 2023-08-21 10:03:42');
    console.info('[system]', 'Last Commit Hash: xx');
  }, 10);
} catch(err) {}
</script>
```

当传入`buildName`时，会将构建信息插入到`buildName`中。

当传入`commitName`时，会将最后一次提交信息插入到`commitName`中。

输出示例：

```html
<script>
try {
  setTimeout(() => {   
    window._vConsoleBuildInfo = {
      time: '2023-08-21 11:54:12',
      author: 'yang',
      branch: 'feature/hor',
      netEnv: '',
    }
        
    window._vConsoleCommitInfo = {
      message: 'xx',
      author: 'xx',
      date: '2023-08-18 19:24:15',
      hash: 'xx',
    }
  }, 1);
} catch(err) {}
</script>
```
