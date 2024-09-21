import * as fs from 'fs';
import { getStyleName } from './style-name';
import { TIP_STYLE_NAME } from './config';
import type { ICrossGameStyleOptions } from './types';


function tryRemoveImport(source: string, removeImport = false) {
  let res = source;
  if (removeImport) {
    res = res.replace(`src="${TIP_STYLE_NAME}"`, '').replace(`src='${TIP_STYLE_NAME}'`, '');
  } else {
    res = res.replace(TIP_STYLE_NAME, '');
  }
  return res;
}


export function crossGameStyle({
  source,
  options,
  dir,

  removeImport = false,
}: {
  source: string;
  options?: ICrossGameStyleOptions;
  dir: string;
  removeImport?: boolean;
}) {
  if (!source.includes(TIP_STYLE_NAME)) {
    return source;
  }

  let styleName: String | Array<String> = '';
  // 使用 env.local 的样式 VUE_APP_DIR = module/ingame-nba，即为 nba
  if (options?.styleName) {
    styleName = options.styleName;
  } else if (getStyleName()) {
    styleName = getStyleName();
  }

  if (Array.isArray(styleName)) {
    if (styleName.length > 1) {
      styleName = styleName.filter((item) => {
        const cssAbsolutePath = `${dir}/css/${item}.scss`;
        return fs.existsSync(cssAbsolutePath);
      });

      if (styleName.length > 1) {
        const styleTags = styleName
          .filter((item) => {
            const cssAbsolutePath = `${dir}/css/${item}.scss`;
            return removeImport ? fs.existsSync(cssAbsolutePath) : true;
          })
          .map(item => `.${item} {@import './css/${item}.scss';}`);

        const res = tryRemoveImport(source, removeImport);
        return res.replace(/<\/style>/, `</style>${['<style scoped lang="scss">', ...styleTags, '</style>'].join('')}`);
      }
    }
    styleName = styleName[0] || '';
  }

  const cssPath = `./css/${styleName}.scss`;
  const cssAbsolutePath = `${dir}/css/${styleName}.scss`;
  const exist = fs.existsSync(cssAbsolutePath);

  if (exist) {
    return source.replace(TIP_STYLE_NAME, cssPath);
  }

  return tryRemoveImport(source, removeImport);
}
