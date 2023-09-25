import { getMpInsertCode } from './helper';
import { updateAssetSource } from '../../helper';

const insertCode = getMpInsertCode();

export class GenVersionMpPlugin {
  options: object;
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('genVersionPlugin', (compilation) => {
      try {
        const { assets } = compilation;
        const key = 'app.js';
        if (!assets[key]) return;

        let source = assets[key].source().toString();
        source = `${insertCode}
        ${source}
        `;

        updateAssetSource(assets, key, source);
      } catch (err) {
        console.log('[GenVersionMpPlugin] err: ', err);
      }
    });
  }
}

