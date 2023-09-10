import * as fs from 'fs';
import { getStyleName } from './style-name';

export function crossGameStyleLoader(this: any, source: string) {
  // 改为异步loader
  const callback = this.async();

  if (source.indexOf('@TIP_STYLE_NAME') !== -1) {
    let styleName: String|Array<String> = '';
    // 使用env.local的样式 VUE_APP_DIR = module/ingame-nba，即为nba
    if (getStyleName()) {
      styleName = getStyleName();
    }
    if (Array.isArray(styleName)) {
      if (styleName.length > 1) {
        styleName = styleName.filter((item) => {
          const cssAbsolutePath = `${this.context}/css/${item}.scss`;
          return fs.existsSync(cssAbsolutePath);
        });
        if (styleName.length > 1) {
          const styleTags = styleName.map(item => `.${item} {@import './css/${item}.scss';}`);
          callback(null, source.replace('@TIP_STYLE_NAME', '').
            replace(/<\/style>/, `</style>${['<style scoped lang="scss">', ...styleTags, '</style>'].join('')}`));
          return;
        }
      }
      styleName = styleName[0] || '';
    }
    const cssPath = `./css/${styleName}.scss`;
    const cssAbsolutePath = `${this.context}/css/${styleName}.scss`;
    const exist = fs.existsSync(cssAbsolutePath);
    if (exist) {
      callback(null, source.replace('@TIP_STYLE_NAME', cssPath));
    } else {
      callback(null, source.replace('@TIP_STYLE_NAME', ''));
    }
  } else {
    callback(null, source);
  }
}

