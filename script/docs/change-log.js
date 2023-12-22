const { insertDocChangeLog } = require('t-comm');
const DOC_CHANGE_LOG_PATH = './docs/CHANGELOG.md';
const SOURCE_CHANGE_LOG_PATH = './CHANGELOG.md';


function main() {
  insertDocChangeLog({
    changelogPath: SOURCE_CHANGE_LOG_PATH,
    docChangelogPath: DOC_CHANGE_LOG_PATH,
    packageJsonPath: './package.json',
  });
}


main();


