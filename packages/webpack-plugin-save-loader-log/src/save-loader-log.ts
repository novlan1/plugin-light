import { saveLoaderLog  } from 'plugin-light-shared';

export class SaveLoaderLogPlugin {
  options: object;

  constructor(options: object) {
    this.options = options || {};
  }


  apply(compiler: any) {
    compiler.hooks.emit.tap('SaveLoaderLogPlugin', () => {
      try {
        saveLoaderLog();
      } catch (err) {
        console.warn('[SAVE LOADER LOG] err', err);
      }
    });
  }
}
