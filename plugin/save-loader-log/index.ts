import { saveLoaderLog  } from '../../helper/loader-log';

export class SaveLoaderLogPlugin {
  options: object;

  constructor(options) {
    this.options = options || {};
  }


  apply(compiler) {
    compiler.hooks.emit.tap('SaveLoaderLogPlugin', () => {
      try {
        saveLoaderLog();
      } catch (err) {
        console.log('[SAVE LOADER LOG] err', err);
      }
    });
  }
}
