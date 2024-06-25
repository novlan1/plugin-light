const glob = require('glob');
const { readFileSync, writeFileSync,
} = require('t-comm');
const { replaceDependencies, parseReplaceConfig } = require('t-comm/lib/ast');
const { REPLACE_CONFIG } = require('./config');
const  { getReplaceTargetDir } = require('./config-common');

const REPLACE_TARGET_DIR = getReplaceTargetDir();


const JS_DIR = `${REPLACE_TARGET_DIR}/**/*.[j|t]s`;
const VUE_DIR = `${REPLACE_TARGET_DIR}/**/*.vue`;

const IMPORT_RE = /import (?:(?!\/\*\*)[\s\S])+ from\s+'.*';\n\n/;
const IMPORT_RE_TWO =  /import (?:(?!\/\*\*)[\s\S])+ from\s+'.*';\n/;
const IMPORT_RE_THREE =  /import (?:(?!\/\*\*)[\s\S])+ from\s+'.*';/;

const newConfig = REPLACE_CONFIG.map((item) => {
  const newSource = Array.isArray(item.source) ? item.source : [item.source];
  newSource.push('src/common');

  return {
    ...item,
    source: newSource,
  };
});
const parsedConfigList = parseReplaceConfig(newConfig);
const remindList = [];


function replaceJS() {
  const list = glob.sync(JS_DIR);
  for (const item of list) {
    if (item.includes('node_modules')) {
      continue;
    }
    const content = readFileSync(item);
    if (!content.includes('src/common') && !content.includes('@tencent/pmd-')) {
      continue;
    }


    console.log('[replaceJS item]', item);
    let temp = replaceOneJs(content, item,  IMPORT_RE_TWO);
    if (!temp) {
      temp = replaceOneJs(content, item, IMPORT_RE);
    }
    if (!temp) {
      temp = replaceOneJs(content, item, IMPORT_RE_THREE);
    }
  }
}

function replaceVue() {
  const list = glob.sync(VUE_DIR);
  for (const item of list) {
    if (item.includes('node_modules')) {
      continue;
    }
    const content = readFileSync(item);
    if (!content.includes('src/common') && !content.includes('@tencent/pmd-')) {
      continue;
    }

    console.log('[replaceVue item]', item);
    const temp = replaceOneJs(content, item, IMPORT_RE);
    if (!temp) {
      replaceOneJs(content, item, IMPORT_RE_TWO);
    }
  }
}


function replaceOneJs(content, file, reg) {
  const match = content.match(reg);
  if (!match?.[0]) {
    return false;
  }

  console.log('[replaceOneJs] match[0]: ', match[0]);
  if (match[0].includes('#endif') || match[0].includes('#ifdef') || match[0].includes('#ifndef')) {
    remindList.push(file);
  }

  let output = replaceDependencies(match[0], parsedConfigList);

  console.log('[replaceOneJs]', file);
  if (output === match[0]) {
    return true;
  }
  console.log('[replaceOneJs.1]', file);
  output = content.replace(reg, `${output}\n\n`);
  writeFileSync(file, output);
  // execCommand(`npx eslint ${file} --fix || true`, REPLACE_TARGET_DIR, 'inherit');
  return true;
}

function main() {
  replaceJS();
  replaceVue();

  writeFileSync('./log/if-def-file-list.json', remindList, true);
  for (const item of remindList) {
    console.log('[Check]: ', item);
  }
}


main();
