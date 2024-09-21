import { fixNpmPackage } from './core';
import type { IFixNpmPackageOptions } from './types';


export class FixNpmPackagePlugin {
  options: IFixNpmPackageOptions;

  constructor(options: IFixNpmPackageOptions) {
    this.options = options || {};
  }


  apply(compiler: any) {
    compiler.hooks.emit.tap('FixNpmPackagePlugin', (compilation: any) => {
      try {
        const { assets } = compilation;
        fixNpmPackage(assets, this.options?.pluginName);
      } catch (err) {
        console.warn('[FIX NPM PACKAGE] err', err);
      }
    });
  }
}
