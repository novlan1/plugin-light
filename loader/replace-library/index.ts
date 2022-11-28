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
  const { replaceLibraryList = [], replaceContentList = [] } = options;
  if (!replaceLibraryList.length && !replaceContentList.length) {
    return source;
  }
  // @ts-ignore
  const { resourcePath } = this;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0;i < replaceContentList.length;i++) {
    const { path, content = '' } = replaceContentList[i];
    const tContent = typeof content === 'function' ? content() : content;
    if (resourcePath.match(new RegExp(path))) {
      console.log(`[Replace Library Loader] 处理了文件：${path} `);
      return tContent;
    }
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

