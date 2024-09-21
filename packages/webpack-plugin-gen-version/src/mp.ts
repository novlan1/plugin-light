import { updateAssetSource, getMpInsertCode, type IGenVersionOptions } from '@plugin-light/shared';

const insertCode = getMpInsertCode();

export class GenVersionMpPlugin {
  options: IGenVersionOptions;
  constructor(options: IGenVersionOptions) {
    this.options = options;
  }

  apply(compiler: any) {
    compiler.hooks.emit.tap('genVersionPlugin', (compilation: any) => {
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
        console.warn('[GenVersionMpPlugin] err: ', err);
      }
    });
  }
}

