# sync-repo

同步仓库代码，适用于“孪生项目”。

## 使用方式

在项目根目录下增加文件`light-cli.config.js`，内容如下：

```js
module.exports = {
  'sync-repo': {
    target: '../pro',
    ignore: [
      'src/common/**/*',
      'src/component/**/*',
    ],
    files: [
      'src/project/user/views/message-center/message-center-index.vue',
      'src/project/user/views/message-center/message-center-detail.vue',

      {
        from: 'src/project/user/mixins/tim-mixin.js',
        level: 0,
      },
    ],
  },
};
```

然后执行:

```bash
npx light-cli
```


## 配置参数说明

- `target`, 目标仓库
- `files`, 要同步的文件列表，会递归查找依赖，并一起更新
- `ignore`, 忽略文件列表，支持glob
- `extensions`, 递归查找的文件类型，默认为`[ts, js, vue, json]`
- `shouldReplaceJS`，是否替换同文件夹下的`js`文件，默认为`true`


### files


`files`支持的类型如下：

```ts
type IFiles = Array<string | {
  from: string | Array<string>,
  level?: number
}>;
```


- `from`可为文件、文件夹、文件（夹）数组，当为文件夹时，会同步该文件夹下所有文件；
- `level`表示向下寻找依赖的层级，当`level`为`0`时，表示只同步顶层文件，默认为`Infinity`，即一直找到下面几种情况才终止：
  - 完全无依赖
  - 依赖三方库
  - 依赖匹配上了`ignore`字段

