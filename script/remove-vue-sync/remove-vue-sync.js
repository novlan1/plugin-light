const glob = require('glob');
const { readFileSync, writeFileSync, execCommand, camelize } = require('t-comm');
const { REMOVE_VUE_SYNC_FILES, PROJECT_ROOT } = require('./config');

const dotSyncReg = /:([\w-]+)\.sync\s*=\s*(?:"([^"]*)"+|'([^']*)'+)/g;
// const vModelMoreReg = /v-model:([\w]+)="([\w]+)"/;

function removeVueSync(source, file) {
  const match = source.match(dotSyncReg);
  if (!match) return '';
  console.log('file', file);

  const result = source.replace(dotSyncReg, (match, name, value) => {
    const propStr = `:${name}="${value}"`;

    const tempValue = value === 'value' ? 'val' : 'value';
    const methodStr = `@update:${camelize(name)}="${tempValue} => ${value} = ${tempValue}"`;

    return [propStr, methodStr].join(' ');
  });


  return result;
}


function main() {
  const list = glob.sync(REMOVE_VUE_SYNC_FILES);

  list.forEach((item) => {
    const content = readFileSync(item, false);
    const newContent = removeVueSync(content, item);

    if (newContent) {
      writeFileSync(item, newContent, false);

      if (PROJECT_ROOT) {
        try {
          lint(item, PROJECT_ROOT);
        } catch (err) {}
      }
      console.log(`[Done] ${item}`);
    }
  });
}

function lint(file, root) {
  execCommand(`npx eslint ${file} --fix`, root, 'inherit');
}

main();
