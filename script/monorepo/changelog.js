const { execCommand } = require('t-comm');

const pwd = process.argv[2];
if (!pwd) {
  throw new Error('缺少包路径');
}


function doChangeLog(pwd) {
  execCommand('conventional-changelog -i CHANGELOG.md -s --commit-path .', pwd, 'inherit');
  console.log('[changelog] done');
}


function main() {
  doChangeLog(pwd);
}

main();
