### 运行步骤

1. 拉取子仓库的代码

`git submodule update --init`

2. 拉取依赖

`npm install`

3. 创建.env.local，更改内容

`cp .env .env.local`

更改文件.env.local内容为，igame-page为要编译的子工程名

`VUE_APP_DIR = project/[igame-page]`

### 如何发布

发布指引参考iWiki [发布前端项目](https://iwiki.woa.com/pages/viewpage.action?pageId=1564466703)

### 三方库



#### 非必要
- blob-polyfill
- clipboard
- echarts
- element-ui
- es6-promise
- file-saver
- html2canvas // 这个在common中是通过懒加载方式，无需写在package.json
- i // inflect
- intersection-observer
- lrz // 图片处理
- minimist
- normalize.css
- npm
- nprogress
- path-to-regexp
- qrcode 
- swiper
- v-clipboard
- v-image-preview
- vconsole
- vue-barcode
- vue-count-to
- vue-cropper
- vue-css-modules
- vue-fragment
- vue-keep-scroll-position
- vue-lazyload
- vue-qr
- xlsx
- y18n



### 必要

- vue-qrcode
- clipboard