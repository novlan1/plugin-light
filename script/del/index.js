const del = require('del');
const fs = require('fs-extra');
function main() {
  del('./log');

  fs.copySync('./lib', './dist');
}

main();
