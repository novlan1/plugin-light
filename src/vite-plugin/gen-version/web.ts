import { getWebInsertCode } from '../../webpack-plugin/gen-version/helper';
import type { IGenVersionOptions } from '../../webpack-plugin/gen-version/types';


export function genVersionWebVitePlugin(options: IGenVersionOptions) {
  return {
    name: 'gen-version-web',

    // for production mode
    transform(code: string, id: string) {
      const insertCode = getWebInsertCode(options);
      if (id.endsWith('.html')) {
        const idx = code.lastIndexOf('</body>');
        const newCode = code.slice(0, idx) + insertCode + code.slice(idx);

        return newCode;
      }
      return code;
    },
    // for development mode
    transformIndexHtml(code: string) {
      const insertCode = getWebInsertCode(options);
      const idx = code.lastIndexOf('</body>');
      const newCode = code.slice(0, idx) + insertCode + code.slice(idx);

      return newCode;
    },
  };
}


