# replace-content


替换打包产物内容


```ts
plugins.push(
  new ReplaceContentPlugin({
    replaceReg: new RegExp('background-image:\\s?url\\(https://cdn\\.dcloud\\.net\\.cn/img\\/.*?.png\\);?'),
    fileNameReg: /\.(css|scss|less|wxss)$/
  })
)
```

