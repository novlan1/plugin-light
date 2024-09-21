const postcss = require('postcss');

const shouldHandle = (configList = [], current) => configList.find(item => item.file.test(current));

module.exports = postcss.plugin('postcss-plugin-remove-selector', (opts = {}) => {
  const { list } = opts;
  return function (root, result) {
    const fileName = result.opts.from;
    const found = shouldHandle(list, fileName);

    if (!found) {
      return;
    }
    const keySelector = found.excludes?.not || [];
    console.log('[Postcss Plugin Remove Select] handling ', fileName);

    root.walkRules((rule) => {
      if (!keySelector.includes(rule.selector)) {
        rule.remove();
      }

      // rule.walkDecls((decl) => {
      //   console.log(`${decl.prop} = ${decl.value}`);
      // });
    });
  };
});
