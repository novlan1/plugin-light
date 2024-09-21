const { readFileSync, writeFileSync } = require('t-comm');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'node_modules/@dcloudio/uni-cli-shared/dist/utils.js');


function fixUniDir() {
  const content = readFileSync(TARGET_FILE, false);
  const insertStr = 'str = str.replace(/^[./]*/, \'\');';
  const newContent = content.replace(/(function\s+normalizeNodeModules\([\s\S]+?)(return str;)/, (origin, pre, post) => {
    if (pre.includes(insertStr)) {
      return origin;
    }
    return pre + insertStr + post;
  });
  writeFileSync(TARGET_FILE, newContent);
}


fixUniDir();
