import { fixNpmPackage } from './core';

export class FixNpmPackagePlugin {
  options: object;

  constructor(options: object) {
    this.options = options || {};
  }


  apply(compiler: any) {
    compiler.hooks.emit.tap('FixNpmPackagePlugin', (compilation: any) => {
      try {
        const { assets } = compilation;
        fixNpmPackage(assets);
      } catch (err) {
        console.log('[FIX NPM PACKAGE] err', err);
      }
    });
  }
}
