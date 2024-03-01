## 发布脚本

发布打包后的内容。

### 如何使用

在`package.json`中声明：


```json
{
  "scripts": {
    "publish": "light-cli publish",
    "publish:prod": "light-cli publish -e prod",
    "publish:devcloud": "light-cli publish -e devcloud",
  }
}
```

然后执行相应的命令即可：

```bash
npm run publish

npm run publish:prod

npm run publish:devcloud
```
