const fs = require('fs');
const glob = require('glob');
const { camelize } = require('t-comm/lib/base/string');

const LOADER_GOLB =  'src/loader/*/index.ts';
const CONFIG_JSON = 'src/loader/config.json';
const INIT_LOADER_CONFIG = {
  publishUtil: './webpack-publish.js',
};

function main() {
  const list = getLoaderList();
  const parsed = parseLoaderList(list);

  fs.writeFileSync(CONFIG_JSON, JSON.stringify(parsed, null, 2), {
    encoding: 'utf-8',
  });

  console.log(`[Init Loader] finished at ${CONFIG_JSON}`);
}

function parseLoaderList(list) {
  return list.reduce((acc, item) => {
    // const itemName = item.replace(/-loader$/, '');
    const loaderName = camelize(item);
    acc[loaderName] = `./loader/${item}.js`;
    acc[`${loaderName}Prod`] = `./loader/${item}.prod.js`;

    return acc;
  }, INIT_LOADER_CONFIG);
}

function getLoaderList() {
  const list = glob.sync(LOADER_GOLB);
  const reg = /src\/loader\/([^/]+)/;
  const loaderList = [];


  list.forEach((item) => {
    const match = item.match(reg);
    if (match?.[1]) {
      loaderList.push(match[1]);
    }
  });
  return loaderList;
}

main();
