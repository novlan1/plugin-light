import path from 'path';
import type { ICrossGameStyleOptions } from './types';
import { crossGameStyle } from 'plugin-light-shared';

function genWarn(source: string, id: string, warnList: Array<string> = []) {
  warnList.forEach((item) => {
    if (source.includes(item)) {
      console.log(`[WARN] ${id} 文件中包含 ${item}`);
    }
  });
}


/**
 * Vite 插件 - 将多游戏样式文件占位符 `@TIP_STYLE_NAME` 转为 对应的文件路径
 * @param options.styleName - 样式名称
 */
export function crossGameStyleVitePlugin(options?: ICrossGameStyleOptions) {
  return {
    name: 'vite-plugin-cross-game-style',
    enforce: 'pre',
    transform(source: string, id: string) {
      genWarn(source, id, options?.warnList);

      if (!id.endsWith('.vue')) {
        return {
          code: source,
          map: null,
        };
      }

      const result = crossGameStyle({
        source,
        options,
        dir: path.dirname(id),
        removeImport: true,
      });

      return {
        code: result,
        map: null,
      };
    },
  };
}

