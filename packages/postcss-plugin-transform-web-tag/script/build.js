const { execCommand } = require('t-comm');
const path = require('path');

function main() {
  const source = path.resolve(__dirname, '../src/*');
  const target = path.resolve(__dirname, '../lib/');
  console.log('[source]', source);
  console.log('[target]', target);

  execCommand(`mkdir -p lib && cp ${source} ${target}`, path.resolve(__dirname, '../'), 'inherit');
}

main();
