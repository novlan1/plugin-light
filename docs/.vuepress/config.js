const fs = require('fs');
const { SHOW_CHANGE_LOG, SHOW_PUBLISH_CLI } = require('./changelog.env');
const SIDEBAR_CONFIG_PATH = './docs/.vuepress/sidebar.json';


function getSidebarConfig() {
  const path = SIDEBAR_CONFIG_PATH;
  const data = fs.readFileSync(path);
  const result = JSON.parse(data).sidebar;
  if (SHOW_PUBLISH_CLI) return result;


  return result.map(item => ({
    ...item,
    children: item.children.filter(child => child.title !== '/zh/script/publish.md'),
  }));
}

const changeLogSidebar = SHOW_CHANGE_LOG ? [
  {
    title: '更新日志',
    path: '/CHANGELOG.md',
  },
] : [];


module.exports = {
  title: 'Plugin Light',
  description: 'Webpack 相关插件、Loader、基础配置',
  base: process.env.PUBLISH_PATH || '/plugin-light/',
  head: [
    [
      'link', { rel: 'icon', href: '/images/favicon.ico' },
    ],
  ],
  markdown: {
    // 显示行号
    lineNumbers: false,
    extractHeaders: ['h2', 'h3', 'h4'],
  },
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN',
      // title: '',
      // description: '',
    },
  },
  themeConfig: {
    sidebarDepth: 0, // 嵌套标题深度
    lastUpdated: 'Last Updated', // string | boolean
    smoothScroll: true,
    nav: [
      {
        text: '源码地址',
        link: 'https://github.com/novlan1/plugin-light',
      },
      {
        text: 'Press UI',
        link: 'https://novlan1.github.io/press-ui/',
      },
    ],
    sidebar: [
      {
        title: '介绍',
        path: '/',
      },
      ...getSidebarConfig(),
      {
        title: '贡献指南',
        path: '/CONTRIBUTING.md',
      },
      ...changeLogSidebar,
    ],
  },

};
