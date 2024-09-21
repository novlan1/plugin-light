import { createLogDir } from '@plugin-light/shared';

import type { IAddCommonVendorOptions } from './types';
import { addCommonVendorCore, insetSpecialContent } from './core';
import { getPageSet } from '@plugin-light/webpack-plugin-dispatch-vue';


export class AddCommonVendorPlugin {
  options: IAddCommonVendorOptions;

  pluginName = 'AddCommonVendorPlugin';


  constructor(options: IAddCommonVendorOptions) {
    this.options = options || {};

    createLogDir();
  }

  apply(compiler: any) {
    compiler.hooks.emit.tap(this.pluginName, (compilation: any) => {
      try {
        const { assets } = compilation;
        const { fileList, content } = this.options || {};

        // 指定插入模式
        if (fileList && content) {
          insetSpecialContent({
            fileList,
            insertCode: content,
            assets,
          });
          return;
        }

        addCommonVendorCore({
          assets,
          pageSet: Array.from(getPageSet()),
          subPackages: Object.keys((process as any).UNI_SUBPACKAGES) || {},
          outputDir: process.env.UNI_OUTPUT_DIR || '',
          postFix: this.options?.postFix,
        });
      } catch (err) {
        console.warn('AddCommonVendorPlugin.err: ', err);
      }
    });
  }
}
