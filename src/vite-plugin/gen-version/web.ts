import { getWebInsertCode } from '../../plugin/gen-version/helper';


export function genVersionWebVitePlugin(options) {
  return {
    name: 'gen-version-web',

    // for production mode
    transform(code, id) {
      const insertCode = getWebInsertCode(options);
      if (id.endsWith('.html')) {
        const idx = code.lastIndexOf('</body>');
        const newCode = code.slice(0, idx) + insertCode + code.slice(idx);

        return newCode;
      }
      return code;
    },
    // for development mode
    transformIndexHtml(code) {
      const insertCode = getWebInsertCode(options);
      const idx = code.lastIndexOf('</body>');
      const newCode = code.slice(0, idx) + insertCode + code.slice(idx);

      return newCode;
    },
  };
}


