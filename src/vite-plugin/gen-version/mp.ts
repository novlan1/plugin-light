import { getMpInsertCode } from '../../webpack-plugin/gen-version/helper';


export function genVersionMpVitePlugin() {
  return {
    name: 'gen-version-mp',

    renderChunk(code: string, chunk: Record<string, any>) {
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
