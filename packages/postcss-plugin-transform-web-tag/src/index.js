/* eslint-disable @typescript-eslint/no-require-imports */

function getPostcssVersion() {
  let version = 8;
  try {
    version = Number(require('postcss/package.json').version.split('.')[0]);
  } catch (err) {}
  return version;
}

const version = getPostcssVersion();

const selectorParser = require('postcss-selector-parser');

const TAG_MAP = {
  span: 'label',
  img: 'image',
  i: 'view',
  p: 'view',
  h4: 'view',
  em: 'view',
  ul: 'view',
  li: 'view',
};

const transformSelector = (complexSelector, transformer) => selectorParser(transformer).processSync(complexSelector);
function once(options) {
  const { tagMap = TAG_MAP } = options || {};

  return function  (root)  {
    root.walkRules((rule) => {
      // Transform each rule here
      // rule.selectors == comma seperated selectors
      // a, b.c {} => ["a", "b.c"]
      rule.selectors = rule.selectors.map(complexSelector =>
      // complexSelector => simpleSelectors
      // "a.b#c" => ["a", ".b", "#c"]
        transformSelector(complexSelector, (simpleSelectors) => {
          simpleSelectors.walkTags((tag) => {
            if (tagMap[tag.value]) {
              tag.value = tagMap[tag.value];
            }
          });
        }));
    });
  };
}

const PLUGIN_NAME = 'transform-web-tag';

if (version < 8) {
  const postcss = require('postcss');
  module.exports = postcss.plugin(PLUGIN_NAME, once);
} else {
  module.exports = function (options) {
    return {
      postcssPlugin: PLUGIN_NAME,
      Once: once(options),
    };
  };

  module.exports.postcss = true;
}
