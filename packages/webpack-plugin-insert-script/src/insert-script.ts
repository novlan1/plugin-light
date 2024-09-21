import { updateAssetSource } from '@plugin-light/shared';
import { getScriptHtml } from './helper';
import type { InsertScriptOptions } from './types';


export class InsertScriptPlugin {
  options: InsertScriptOptions;

  constructor(options: InsertScriptOptions = {}) {
    this.options = options || {};
  }


  apply(compiler: any) {
    compiler.hooks.emit.tap('insertScriptPlugin', (compilation: any) => {
      try {
        const { assets } = compilation;
        const key = 'index.html';
        if (!assets[key]) return;

        const { scripts } = this.options;
        if (!scripts!.length) return;

        const insertCode = getScriptHtml(this.options.scripts || []);

        const source = assets[key].source().toString();
        const idx = source.lastIndexOf('</head>');
        const newSource = source.slice(0, idx) + insertCode + source.slice(idx);

        updateAssetSource(assets, key, newSource);
      } catch (err) {
        console.warn('[GenVersionMpPlugin] err: ', err);
      }
    });
  }
}
