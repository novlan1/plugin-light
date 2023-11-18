import { getOptions } from 'loader-utils';
import { getStyleList, genInjectContent, getComponentName } from './helper';
import { shouldUseLoader } from '../../helper/loader-options';
import { PLATFORM_MAP } from '../../helper/config';

export function injectDynamicStyleWeb(this: any, source) {
  if (!shouldUseLoader.call(this, [PLATFORM_MAP.H5])) return source;

  const options = getOptions(this) || {};
  const { topElement = 'body' } = options;

  const dir = this.context;
  const componentName = getComponentName(dir);
  if (!componentName) {
    return source;
  }

  const styleList = getStyleList(dir);
  const injectContent = genInjectContent({
    styleList,
    componentName,
    topElement,
    dir: '',
  });

  return `${source}\n${injectContent}`;
}

