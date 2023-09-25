import { getMpInsertCode } from '../../plugin/gen-version/helper';


export function genVersionMpVitePlugin() {
  return {
    name: 'gen-version-mp',

    renderChunk(code, chunk) {
      const id = chunk.fileName;

      if (id === 'app.js') {
        const insertCode = getMpInsertCode();
        const newCode = `${insertCode}
  ${code}
  `;
        return newCode;
      }

      return code;
    },
  };
}
