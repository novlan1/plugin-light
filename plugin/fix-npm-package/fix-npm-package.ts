import { fixNpmPackage } from './core';

export class FixNpmPackagePlugin {
  options: object;

  constructor(options) {
    this.options = options || {};
  }


  apply(compiler) {
    compiler.hooks.emit.tap('FixNpmPackagePlugin', (compilation) => {
      try {
        const { assets } = compilation;
        fixNpmPackage(assets);
      } catch (err) {
        console.log('[FIX NPM PACKAGE] err', err);
      }
    });
  }
}
