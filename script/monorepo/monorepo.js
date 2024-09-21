
const { execCommand, readFileSync, writeFileSync } = require('t-comm');
const args = process.argv.slice(2);
const fs = require('fs');
console.log('args', args);

const originDir = args[0];
if (!originDir) {
  // throw new Error('请输入原始文件目录');
}

const templateName = 'packages/webpack-plugin-rem-to-rpx';

const copyFile = [
  '.babelrc',
  'package.json',
  'rollup.config.js',
  'tsconfig.json',
];

const exec = (command) => {
  execCommand(command, process.cwd(), 'inherit');
};
const genNewDir = (dir) => {
  const list = dir.split('/');
  return list.slice(list.length - 2).join('-');
};

const changePackageName = (target, name) => {
  const json = readFileSync(target, true);
  json.name = name;
  writeFileSync(target, json, true);
};

function cpFilesToMonoRepo(originDir) {
  const newDirName = genNewDir(originDir);
  console.log('newDirName', newDirName);
  const targetDir = `packages/${newDirName}/src`;
  if (fs.existsSync(targetDir)) {
    console.log(`${targetDir} 已存在`);
    return;
  }
  exec(`mkdir -p ${targetDir}`);

  exec(`cp -r ${originDir}/* ${targetDir}`);

  const toCopyFiles = copyFile.map(item => `${templateName}/${item}`).join(' ');

  exec(`cp -r ${toCopyFiles} packages/${newDirName}`);

  changePackageName(`packages/${newDirName}/package.json`, `${newDirName}`);

  exec(`pnpm --filter=${newDirName} install`);
  // exec(`pnpm --filter=${newDirName} run build`);
}

function main() {
  const TARGET = 'src/project-config';
  const list = fs.readdirSync(TARGET);
  console.log('list', list);
  list.forEach((item) => {
    if (item !== 'index.ts' && item !== 'config.json') {
      cpFilesToMonoRepo(`${TARGET}/${item}`);
    }
  });
}

main();
