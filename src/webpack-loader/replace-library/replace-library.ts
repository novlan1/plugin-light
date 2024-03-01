import { replaceAllPolyfill } from 't-comm';
import { getOptions } from 'loader-utils';
import { recordLoaderLog } from '../../helper/loader-log';
import { getRelativePath } from '../../helper/index';
import { shouldUseLoader, PLATFORMS_MP } from '../../helper/loader-options';
import type { IReplaceLibraryOptions } from './types';

/**
 * 转换vant等组件，比如
 * import { Tab, Tabs } from 'vant'  转为：import { Tab, Tabs } from 'test';
 * import List from 'vant/lib/list'  转为：import List from 'test';
 * import 'vant/lib/list/index.css'  转为：import 'test'
 */
export function replaceLibrary(this: any, source: string) {
  replaceAllPolyfill();
  if (!shouldUseLoader.call(this, PLATFORMS_MP)) return source;

  const options: IReplaceLibraryOptions = getOptions(this) || {};

  const { replaceLibraryList = [], replaceContentList = [] } = options;
  if (!replaceLibraryList?.length && !replaceContentList.length) {
    return source;
  }
  const { resourcePath } = this;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0;i < replaceContentList.length;i++) {
    const { path, content = '' } = replaceContentList[i];
    const tContent = typeof content === 'function' ? content() : content;

    if (resourcePath.match(new RegExp(path))) {
      recordLoaderLog('replace-library.json', {
        file: getRelativePath(resourcePath),
        type: 'CONTENT',
        path,
      });
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
        recordLoaderLog('replace-library.json', {
          file: getRelativePath(resourcePath),
          type: 'LIBRARY',
          from,
          to,
        });
      }
    }
  }


  return res;
}

