const { getOptions } = require('loader-utils');


/**
 * 转换vant等组件，比如
 * import { Tab, Tabs } from 'vant'  转为：import { Tab, Tabs } from 'test';
 * import List from 'vant/lib/list'  转为：import List from 'test';
 * import 'vant/lib/list/index.css'  转为：import 'test'
 */
function replaceLibrary(source) {
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin' && process.env.VUE_APP_PLATFORM !== 'mp-qq') {
    return source;
  }
  const options = getOptions(this) || {};
  const { replaceLibraryList = [] } = options;
  if (!replaceLibraryList.length) {
    return source;
  }
  let res = source;

  for (let i = 0;i < replaceLibraryList.length;i++) {
    const { from, to, exact } = replaceLibraryList[i];

    if (exact) {
      res = res.replaceAll(`'${from}'`, `'${to}'`);
    } else {
      const importRe = new RegExp(`(?<=import(?:[\\s\\S]+from)?\\s+)(?:'|")(${from}[\\w\\/\\-\\.]*)(?:'|")`);

      if (importRe.test(res)) {
        res = res.replace(importRe, () => `'${to}'`);
      }
    }
  }

  return res;
}

module.exports = replaceLibrary;
