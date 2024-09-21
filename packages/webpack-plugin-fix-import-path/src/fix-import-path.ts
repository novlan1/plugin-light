import path from 'path';
import { replaceAllPolyfill } from 't-comm';

import { fixImportPath } from './core';
import { createLogDir, saveJsonToLog,  updateAssetSource } from '@plugin-light/shared';
import type { IFixImportPathOptions } from './types';


replaceAllPolyfill();


const HANDLE_LIST = [
  'common/vendor.js',
  'common/runtime.js',
  'common/main.js',
];


export class FixImportPathPlugin {
  outputDir = process.env.UNI_OUTPUT_DIR || '';
  handleList: Array<string> = HANDLE_LIST;
  options?: IFixImportPathOptions;


  constructor(options: IFixImportPathOptions) {
    this.options = options;

    if (options?.pluginName) {
      this.outputDir = path.resolve(this.outputDir, options.pluginName);
    }
    if (options?.handleList) {
      this.handleList = options.handleList;
    }
    createLogDir();
  }

  apply(compiler: any) {
    if (!this.handleList.length) {
      return;
    }

    compiler.hooks.emit.tap('FixImportPathPlugin', (compilation: any) => {
      const { assets } = compilation;
      this.modifyRef(assets);
    });
  }


  modifyRef(assets: Record<string, any>) {
    const allLogData = [];

    for (const key of Object.keys(assets)) {
      const value = assets[key];
      if (key.endsWith('.js')) {
        const source = value.source().toString();

        const filePath = path.resolve(this.outputDir, key);
        const { newSource, logData = [] } = fixImportPath({
          source,
          filePath,
          root: this.outputDir,
          assets,
          handleList: this.handleList,
        });

        updateAssetSource(assets, key, newSource);

        allLogData.push({
          file: filePath,
          logData,
        });
      }
    }

    saveJsonToLog(allLogData, 'fix-import-path.result.json');
  }
}

