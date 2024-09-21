const fs = require('fs');
const glob = require('glob');
const { execCommand } = require('t-comm');
const SIDEBAR_CONFIG_PATH = './docs/.vuepress/sidebar.json';


const PREFIX_NAME_MAP = {
  'project-config-': 'project-config',
  'webpack-plugin-': 'webpack-plugin',
  'vite-plugin-': 'vite-plugin',
  'postcss-plugin-': 'postcss-plugin',
  'webpack-loader-': 'webpack-loader',
  'plugin-light-': 'base',
  'uni-read-pages-vite': 'base',

};

function getType(pkgName) {
  const keys = Object.keys(PREFIX_NAME_MAP);

  for (const key of keys) {
    if (pkgName.startsWith(key)) {
      return PREFIX_NAME_MAP[key];
    }
  }
  return 'unknown';
}

function traverseEveryFolder() {
  const target = './packages/*/README.md';
  const list = [];
  const globList = glob.sync(target);

  globList.sort((a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  });
  globList.forEach((item) => {
    console.log(item);
    const reg = /packages\/([\w-]+)\/README.md/;
    const match = item.match(reg);
    const name = match[1];
    const type = getType(name);
    const targetDir = './docs/zh';
    const target = `${targetDir}/${name}.md`;

    list.push({
      file: item,
      name,
      type,
      targetDir,
      target,
    });
  });

  return list;
}


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


function genSidebarJson(list) {
  function filterList(type) {
    return list
      .filter(item => item.type === type)
      .map((item) => {
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
      children: filterList('vite-plugin'),
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
      title: '底层依赖',
      collapsable: false,
      children: filterList('base'),
    },
    // {
    //   title: 'CLI 命令',
    //   collapsable: false,
    //   children: filterList('cli'),
    // },
    // {
    //   title: 'Stylelint 插件',
    //   collapsable: false,
    //   children: filterList('stylelint-plugin'),
    // },
  ];

  return {
    sidebar: baseConfig,
  };
}


/**
 * 1. 拷贝 docs
 * 2. 生成 sidebar
 */
function main() {
  const list = traverseEveryFolder();
  // console.log('list', list);
  const sidebar = genSidebarJson(list);

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
