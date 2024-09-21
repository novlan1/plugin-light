const fs = require('fs');
const { traverseFolder, execCommand } = require('t-comm');

const SIDEBAR_CONFIG_PATH = './docs/.vuepress/sidebar.json';


function getMdTitle(file) {
  const reg = /^##\s+(.*)/;
  const data = fs.readFileSync(file, {
    encoding: 'utf-8',
  });
  const match = data.match(reg);
  if (match?.[1]) {
    return match[1].trim();
  }
}


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
  traverseEveryFolder('./src/webpack-loader', 'webpack-loader', list);
  traverseEveryFolder('./src/webpack-plugin', 'webpack-plugin', list);
  traverseEveryFolder('./src/vite-plugin', 'vite', list);
  traverseEveryFolder('./src/cli', 'cli', list);
  traverseEveryFolder('./src/project-config', 'project-config', list);
  traverseEveryFolder('./src/stylelint-plugin', 'stylelint-plugin', list);
  traverseEveryFolder('./src/postcss-plugin', 'postcss-plugin', list);
  return list;
}


function genSidebarJson(list) {
  function filterList(type) {
    return list.filter(item => item.type === type).map((item) => {
      const path = item.target.replace('./docs', '');
      return {
        title: getMdTitle(item.file) || item.name,
        path,
      };
    });
  }

  const baseConfig = [
    {
      title: 'Webpack 插件',
      collapsable: false,
      children: filterList('webpack-plugin'),
    },
    {
      title: 'Webpack Loader',
      collapsable: false,
      children: filterList('webpack-loader'),
    },
    {
      title: 'Vite 插件',
      collapsable: false,
      children: filterList('vite'),
    },
    {
      title: 'Postcss 插件',
      collapsable: false,
      children: filterList('postcss-plugin'),
    },
    {
      title: '项目配置',
      collapsable: false,
      children: filterList('project-config'),
    },
    {
      title: 'CLI 命令',
      collapsable: false,
      children: filterList('cli'),
    },
    {
      title: 'Stylelint 插件',
      collapsable: false,
      children: filterList('stylelint-plugin'),
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
  execCommand('rm -rf ./docs/zh/*', process.cwd(), 'inherit');

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
