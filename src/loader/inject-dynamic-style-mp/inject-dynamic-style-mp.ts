import * as path from 'path';
import { getOptions } from 'loader-utils';
import { getStyleList, genInjectContent, BASE_SCSS } from '../inject-dynamic-style-web/helper';
import { shouldUseLoader, PLATFORMS_MP } from '../../helper/loader-options';

// 某些组件不一定存在 @TIP_STYLE_NAME
const CSS_PATH = `./css/${BASE_SCSS}`;

function getComponentName(dir) {
  const match = dir.match(/\/([^/]+)$/);
  return match?.[1] || '';
}


export function injectDynamicStyleMp(this: any, source) {
  if (!shouldUseLoader.call(this, PLATFORMS_MP)) return source;

  const options = getOptions(this) || {};
  const { topElement = 'body' } = options;

  const dir = this.context;
  const componentName = getComponentName(dir);

  if (!componentName) {
    return source;
  }
  if (source.indexOf(CSS_PATH) < 0) {
    return source;
  }

  const cssDir = path.join(dir, 'css');
  const styleList = getStyleList(cssDir);

  if (!styleList.length) {
    return source;
  }

  const reg = new RegExp(`src=["']${CSS_PATH}["']>[^<]*</style>`);

  const injectContent = genInjectContent({
    styleList,
    componentName,
    topElement,
    dir: 'css/',
  });

  const newContent = source.replace(reg, `>${injectContent}</style>`);

  return newContent;
}

