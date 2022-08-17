const { getOptions } = require('loader-utils');


/**
 * 转换vant等组件，比如
 * import { Tab, Tabs } from 'vant'  转为：import { Tab, Tabs } from 'test';
 * import List from 'vant/lib/list'  转为：import List from 'test';
 * import 'vant/lib/list/index.css'  转为：import 'test'
 */
function replaceLibrary(source) {
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin') {
    return source;
  }
  const options = getOptions(this) || {};
  const { libraryList = [], fakeLibraryList = [] } = options;
  if (!libraryList.length
    || !fakeLibraryList.length
    || libraryList.length !== fakeLibraryList.length) {
    return source;
  }
  let res = source;

  for (let i = 0;i < libraryList.length;i++) {
    const library = libraryList[i];
    const fakeLibrary = fakeLibraryList[i];

    const importRe = new RegExp(`(?<=import(?:[\\s\\S]+from)?\\s+)(?:'|")(${library}[\\w\\/\\-\\.]*)(?:'|")`);

    if (importRe.test(res)) {
      res = res.replace(importRe, () => `'${fakeLibrary}'`);
    }
  }

  return res;
}

module.exports = replaceLibrary;

