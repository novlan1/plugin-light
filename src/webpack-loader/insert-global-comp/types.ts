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
