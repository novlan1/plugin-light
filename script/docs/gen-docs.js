const fs = require('fs');
const { traverseFolder, execCommand } = require('t-comm');

const SIDEBAR_CONFIG_PATH = './docs/.vuepress/sidebar.json';

function traverseEveryFolder(dir, type, list) {
  traverseFolder((file) => {
    const reg = /([^/]+)\/README\.md$/;
    const match = file.match(reg);

    if (match) {
      const name = match[1];
      const targetDir = `./docs/zh/${type}`;
      const target = `${targetDir}/${name}.md`;

      list.push({
        file,
        name,
        type,
        targetDir,
        target,
      });
    }
  }, dir);
}

function getDocsList() {
  const list = [];
  traverseEveryFolder('./src/loader', 'loader', list);
  traverseEveryFolder('./src/plugin', 'plugin', list);
  traverseEveryFolder('./src/task', 'script', list);
  traverseEveryFolder('./src/webpack', 'config', list);
  return list;
}


function genSidebarJson(list) {
  function filterList(type) {
    return list.filter(item => item.type === type).map((item) => {
      const path = item.target.replace('./docs', '');
      return {
        title: item.name,
        path,
      };
    });
  }

  const baseConfig = [
    {
      title: '插件',
      collapsable: false,
      children: filterList('plugin'),
    },
    {
      title: 'loader',
      collapsable: false,
      children: filterList('loader'),
    },
    {
      title: '基础配置',
      collapsable: false,
      children: filterList('config'),
    },
    {
      title: 'CLI命令',
      collapsable: false,
      children: filterList('script'),
    },
  ];

  return {
    sidebar: baseConfig,
  };
}

function main() {
  const list = getDocsList();
  const sidebar = genSidebarJson(list);

  // console.log('[list]', list);

  list.forEach((item) => {
    execCommand(
      `mkdir -p ${item.targetDir} && cp ${item.file} ${item.target}`,
      process.cwd(),
      'inherit',
    );
  });


  fs.writeFileSync(SIDEBAR_CONFIG_PATH, JSON.stringify(sidebar, null, 2), {
    encoding: 'utf-8',
  });
}


main();
