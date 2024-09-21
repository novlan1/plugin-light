import { preprocess } from 'packages/plugin-light-preprocess/lib';
import type { IIfdefOptions } from 'plugin-light-shared';


export function ifdefVitePlugin(options?: IIfdefOptions) {
  return {
    name: 'ifdef',
    // 必须增加 pre，在 vite 核心插件执行前执行
    enforce: 'pre',
    transform(source: string, id: string) {
      const { type = '', context = {} } = options || {};
      let content = source;
      const types = Array.isArray(type) ? type : [type];

      types.forEach((type: string) => {
        try {
          content = preprocess(content, context, {
            type,
          });
        } catch (e) {
          console.error(`${id} process failed`);
        }
      });

      return {
        code: content,
        map: null,
      };
    },
  };
}
