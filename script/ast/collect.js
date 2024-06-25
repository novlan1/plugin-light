const glob = require('glob');
const { readFileSync, writeFileSync } = require('t-comm');

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { parseComponent } = require('vue-template-compiler');

const COLLECT_DIR = '/Users/yang/Documents/git-woa/component/**/*.[j|t]s';
const COLLECT_VUE_DIR = '/Users/yang/Documents/git-woa/component/**/*.vue';

const sourceList = [];


function getVueComponent() {
  const list = glob.sync(COLLECT_VUE_DIR);
  for (const item of list) {
    if (item.includes('node_modules')) {
      continue;
    }
    const content = readFileSync(item);
    if (!content.includes('src/common')) {
      continue;
    }

    console.log('[getVueComponent item]', item);
    collectVue(content);
  }
}


function collectVue(source) {
  const parsed = parseComponent(source);
  const { script = {} } = parsed;
  collectJs(script.content);
}


function getJsFile() {
  const list = glob.sync(COLLECT_DIR);

  for (const item of list) {
    if (item.includes('node_modules')) {
      continue;
    }
    const content = readFileSync(item);
    if (!content.includes('src/common')) {
      continue;
    }

    console.log('[getJsFile item]', item);
    collectJs(content);
  }
}

function main() {
  getVueComponent();
  getJsFile();

  const parsed = parseSourceList(sourceList);
  writeFileSync('./log/collect.json', parsed, true);
  console.log('[parsed.length]', Object.keys(parsed).length);
}


function collectJs(content) {
  const ast = parser.parse(content, {
    // 不加这个配置，报错：SyntaxError: 'import' and 'export' may appear only with 'sourceType: "module"'
    sourceType: 'module',
    plugins: ['typescript'],
  });

  traverse(ast, {
    ImportDeclaration(path) {
      const sourceValue = path.node.source.value;
      const importedList = path.node.specifiers.map((item) => {
        const { type } = item;

        return {
          type,
          value: item.local.name,
        };
      });

      if (sourceValue.includes('src/common')) {
        sourceList.push({
          sourceValue,
          importedList,
        });
      }
    },
  });
}


function parseSourceList() {
  return sourceList.reduce((acc, item) => {
    if (acc[item.sourceValue]) {
      item.importedList.forEach((imported) => {
        const found = acc[item.sourceValue].find(it => it.value === imported.value || it.type === imported.type);
        if (!found) {
          acc[item.sourceValue].push(imported);
        }
      });
    } else {
      acc[item.sourceValue] = item.importedList;
    }
    return acc;
  }, {});
}


main();
