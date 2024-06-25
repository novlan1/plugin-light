import { createLogDir } from '../../helper/index';

import type { IAddCommonVendorOptions } from './types';
import { addCommonVendorCore } from '../add-common-vendor/core';
import { getPageSet } from '../dispatch-vue/helper';


export class AddCommonVendorPlugin {
  options: IAddCommonVendorOptions;

  pluginName = 'AddCommonVendorPlugin';


  constructor(options: IAddCommonVendorOptions) {
    this.options = options;

    createLogDir();
  }

  apply(compiler: any) {
    compiler.hooks.emit.tap(this.pluginName, (compilation: any) => {
      try {
        const { assets } = compilation;

        addCommonVendorCore({
          assets,
          pageSet: Array.from(getPageSet()),
          subPackages: Object.keys((process as any).UNI_SUBPACKAGES) || {},
          outputDir: process.env.UNI_OUTPUT_DIR || '',
          postFix: this.options.postFix,
        });
      } catch (err) {
        console.warn('DispatchScriptPlugin.err: ', err);
      }
    });
  }
}
