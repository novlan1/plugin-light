import path from 'path';
import fs from 'fs';
import { TIP_STYLE_NAME } from '../../webpack-loader/cross-game-style/config';
import type { ICrossGameStyleOptions } from './types';


/**
 * Vite 插件 - 将多游戏样式文件占位符 `@TIP_STYLE_NAME` 转为 对应的文件路径
 * @param options.styleName - 样式名称
 */
export function crossGameStyleVitePlugin(options?: ICrossGameStyleOptions) {
  const { styleName = '' } = options || {};

  return {
    name: 'vite-plugin-cross-game-style',

    transform(source: string, id: string) {
      let res = source;

      if (res.indexOf(TIP_STYLE_NAME) !== -1) {
        const curDir = path.dirname(id);

        let pureCSSLink = `./css/${styleName}.scss`;
        const cssLink = path.resolve(curDir, pureCSSLink);

        const isExist = fs.existsSync(cssLink);
        if (!isExist) {
          pureCSSLink = '';
        }

        res = res.replace(new RegExp(TIP_STYLE_NAME, 'g'), pureCSSLink);
      }
      return {
        code: res,
        map: null,
      };
    },
  };
}

