/* eslint-disable @typescript-eslint/no-require-imports */
import { replaceSource } from './core';

const fs = require('fs');


String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};

export class TransferLocalFilePlugin {
  options?: {
    isModifyRef?: boolean
    adapterDirs: Array<string>
  };

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { isModifyRef = false  } = this.options || {};
    compiler.hooks.emit.tap('moveComponentPlugin', (compilation) => {
      const { assets } = compilation;
      this.moveComp(assets);
      if (isModifyRef) {
        this.modifyRef(assets);
      }

      if (!fs.existsSync('./log')) {
        fs.mkdirSync('./log');
      }

      fs.writeFileSync('./log/assets.json', JSON.stringify(Object.keys(assets), null, 2));
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
    // const reg = new RegExp(`\\.\\./\\.\\./(?=(${adapterDirs.join('|')}))`, 'g');

    for (const key of Object.keys(assets)) {
      const value = assets[key];
      if (key.endsWith('.js') || key.endsWith('.json')) {
        let source = value.source().toString();
        // source = source.replaceAll(reg, '');

        source = replaceSource(source, adapterDirs);

        assets[key].source = function () {
          return source;
        };
        assets[key].size = function () {
          return source.length;
        };
      }
    }
  }
}

