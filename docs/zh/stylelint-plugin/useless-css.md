## 无用样式检测

规则名为 `no-useless-css`，会检测一个样式文件（`css/scss/less`）中未使用到的部分。

原理是搜寻样式文件的前两级，如果有 Vue 文件引入此样式文件，就解析出此 Vue 文件的所有类名。如果样式文件中出现了 Vue 文件中不存在的类名，就会报错。

这个规则适用的项目架构如下：

```
- folder
  - a.scss
  - a.vue 
```

或者

```
- folder
  - css-folder
    - a.scss
  - a.vue
```

效果示例：

<img src="https://mike-1255355338.cos.ap-guangzhou.myqcloud.com/article/2024/2/own_mike_7ecd5bfe2fe692d35b.png" width="500">

### 如何使用

`.stylelintrc.js`设置如下：


```js
module.exports = {
  root: true,
  defaultSeverity: 'error',
  extends: ['stylelint-config-common'],
  plugins: [
    'stylelint-scss', 
     // 引入插件
    'plugin-light/lib/stylelint-plugin',
  ],
  customSyntax: 'postcss-html',
  overrides: [
    {
      files: ['**/*.{scss,css,sass,vue}'],
      customSyntax: 'postcss-scss',
    },
  ],
  rules: {
     // 这里使用
    'stylelint-plugin/no-useless-css': true,
  },
};
```

### 常见问题

1. 冗余样式检测不准确？

本插件获取 Vue 文件所有类名有局限性，无法获取以下类型：

- 拼接的类名，如 `'a' + 'b'`
- 写在脚本中的类名
- 子组件、父组件的类名

基于此，本规则并未提供一键修复功能，而是让用户手动确认、手动修复。

2. VSCode 不报错？

可能是配置不正确，需要安装 `stylelint-scss` 包，并配置正确的 `settings.json`，示例如下：

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit",
  "source.fixAll.stylelint": "always"
},
"stylelint.validate": [
  "css",
  "less",
  "postcss",
  "scss",
  "sass"
],
```

3. TIP_STYLE_NAME

`@TIP_STYLE_NAME` 是我们项目独有的关键词。本插件遇到这个关键词时，会将 Vue 文件视为使用者。

