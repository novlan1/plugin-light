## 全局组件注入

插入公共组件的`loader`，比如`dialog`、`header`，这些几乎所有页面都会用到的组件，适合用这个`loader`。


## 使用方法

首先需要在`main.js`中将组件全局注册下：


```ts
import MatchCommDialog from 'press-ui/press-dialog/press-dialog.vue';
import GlobalComponent from 'src/local-component/module/tip-match/global-component/index-mp.vue';

Vue.component('MatchCommDialog', MatchCommDialog);
Vue.component('GlobalComponent', GlobalComponent);
```

在 `vue.config.js` 中配置如下：

```ts
const { LOADER: insertGlobalComp } = require('webpack-loader-insert-global-comp')';

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('global-comp-vue')
      .test(/\.vue$/)
      .pre()
      .use(insertGlobalComp)
      .loader(insertGlobalComp)
      .options({
        pages: ['/Users/mike/Documents/web/src/project/user/views/index/index-home.vue'],
        components: [{
          isOnTop: false,
          name: 'MatchCommDialog', // 组件名称
          id: 'tip-match-comm-tips-dialog',
        },
        {
          isOnTop: false,
          name: 'GlobalComponent', // 组件名称
          id: 'global-component',
        }],
        platforms: ['mp-weixin', 'mp-qq', 'h5'],
      })
      .end();
  },
};
```

### 参数

```ts
export type IInsertGlobalCompOptions = {
  // 插入的组件列表
  components: Array<{
    // 组件名称
    name: string;
    // 组件 id
    id: string;
    // 是否在顶部，默认 false
    isOnTop?: boolean;
  }>;

  // 处理的平台，默认 ['mp-weixin', 'mp-qq']
  platforms?: Array<string>;

  // 处理的页，默认为 `pages.json` 中所有页面
  pages?: Array<string>;
};
```

### 文章

[uni-app小程序全局组件的优化](https://juejin.cn/post/7130582926655225887)
