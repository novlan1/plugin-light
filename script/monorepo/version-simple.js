const { execCommand } = require('t-comm');

const pwd = process.argv[2];
if (!pwd) {
  throw new Error('缺少包路径');
}

const version = process.argv[3] || 'patch';


function doChangeLog(pwd) {
  console.log(`[version-simple] version is ${version}`);
  execCommand(`npm version ${version}`, pwd, 'inherit');
  console.log('[version-simple] done');
}


function main() {
  doChangeLog(pwd);
}

main();
