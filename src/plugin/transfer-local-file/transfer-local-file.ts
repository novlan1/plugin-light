import { replaceAllPolyfill } from 't-comm';
import { replaceSource } from './core';
import { createLogDir, saveJsonToLog, updateAssetSource } from '../../helper';

replaceAllPolyfill();

export class TransferLocalFilePlugin {
  options?: {
    isModifyRef?: boolean
    adapterDirs: Array<string>
  };

  constructor(options) {
    this.options = options;
    createLogDir();
  }

  apply(compiler) {
    const { isModifyRef = false  } = this.options || {};
    compiler.hooks.emit.tap('moveComponentPlugin', (compilation) => {
      const { assets } = compilation;
      this.moveComp(assets);
      if (isModifyRef) {
        this.modifyRef(assets);
      }

      saveJsonToLog(Object.keys(assets), 'transfer-local-file.assets.json');
    });
  }

  moveComp(assets) {
    const { adapterDirs = []  } = this.options || {};
    const movePrefixList = adapterDirs.map(item => `../../${item}`);

    const isMoveDir = (key, dirs) => !!dirs.find(item => key.startsWith(item));
    const getNewKey = key => key.replace(/^\.\.\/\.\.\//, '');

    for (const key of Object.keys(assets)) {
      if (isMoveDir(key, movePrefixList)) {
        const newKey = getNewKey(key);
        assets[newKey] = assets[key];
        delete assets[key];
      }
    }
  }

  modifyRef(assets) {
    const { adapterDirs = []  } = this.options || {};

    for (const key of Object.keys(assets)) {
      const value = assets[key];
      if (key.endsWith('.js') || key.endsWith('.json')) {
        let source = value.source().toString();

        source = replaceSource(source, adapterDirs);

        updateAssetSource(assets, key, source);
      }
    }
  }
}

