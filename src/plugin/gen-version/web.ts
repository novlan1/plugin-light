import { getWebInsertCode } from './helper';
import { updateAssetSource } from '../../helper';

export class GenVersionWebPlugin {
  options: object;

  constructor(options: Record<string, any> = {}) {
    this.options = options || {};
  }


  apply(compiler) {
    compiler.hooks.emit.tap('genVersionPlugin', (compilation) => {
      try {
        const { assets } = compilation;
        const key = 'index.html';
        if (!assets[key]) return;

        const source = assets[key].source().toString();
        const insertCode = getWebInsertCode(this.options);

        const idx = source.lastIndexOf('</body>');
        const newSource = source.slice(0, idx) + insertCode + source.slice(idx);

        updateAssetSource(assets, key, newSource);
      } catch (err) {
        console.log('[GenVersionMpPlugin] err: ', err);
      }
    });
  }
}
