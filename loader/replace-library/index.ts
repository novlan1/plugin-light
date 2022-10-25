import { replaceAllPolyfill } from '../../helper/utils/replace-all';

/* eslint-disable @typescript-eslint/no-require-imports */
const { getOptions } = require('loader-utils');


/**
 * 转换vant等组件，比如
 * import { Tab, Tabs } from 'vant'  转为：import { Tab, Tabs } from 'test';
 * import List from 'vant/lib/list'  转为：import List from 'test';
 * import 'vant/lib/list/index.css'  转为：import 'test'
 */
export default function replaceLibrary(source) {
  replaceAllPolyfill();
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin' && process.env.VUE_APP_PLATFORM !== 'mp-qq') {
    return source;
  }
  // @ts-ignore
  const options = getOptions(this) || {};
  const { replaceLibraryList = [] } = options;
  if (!replaceLibraryList.length) {
    return source;
  }
  let res = source;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0;i < replaceLibraryList.length;i++) {
    const { from, to, exact } = replaceLibraryList[i];

    if (exact) {
      res = res.replaceAll(`'${from}'`, `'${to}'`);
    } else {
      const importRe = new RegExp(`(?<=import(?:[\\s\\S]+from)?\\s+)(?:'|")(${from}[\\w\\/\\-\\.]*)(?:'|")`);

      if (importRe.test(res)) {
        res = res.replaceAll(importRe, () => `'${to}'`);
      }
    }
  }

  return res;
}

