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
const { LOADER_MAP } = 'plugin-light/lib/loader';

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('global-comp-vue')
      .test(/\.vue$/)
      .pre()
      .use(LOADER_MAP.insertGlobalComp)
      .loader(LOADER_MAP.insertGlobalComp)
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

### Loader 参数

| 参数       | 说明       | 类型                 | 默认值                   |
| ---------- | ---------- | -------------------- | ------------------------ |
| pages      | 处理的页面 | _Array\<string\>_    | pages.json中所有页面     |
| components | 插入的组件 | _Array\<Component\>_ | -                        |
| platforms  | 处理的平台 | _Array\<string\>_    | `['mp-weixin', 'mp-qq']` |


Component


| 参数    | 说明       | 类型      | 默认值 |
| ------- | ---------- | --------- | ------ |
| name    | 组件名称   | _string_  | -      |
| id      | 组件id     | _string_  | -      |
| isOnTop | 是否在顶部 | _boolean_ | false  |



### 文章

[uni-app小程序全局组件的优化](https://juejin.cn/post/7130582926655225887)
