import path from 'path';
import fs from 'fs-extra';
import type { IReplaceUniH5PluginOption } from './types';

const UNI_H5_LIB = path.resolve(process.cwd(), 'node_modules/@dcloudio/uni-h5/dist');


export class ReplaceUniH5Plugin {
  pluginName: String;
  uniH5Version: String;

  constructor(options: IReplaceUniH5PluginOption) {
    this.pluginName = 'ReplaceUniH5Plugin';
    this.uniH5Version = options.version;
  }

  apply(compiler: any) {
    const sourcePath = path.join(__dirname, `../uni-h5/${this.uniH5Version}`);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`\n[ReplaceUniH5Plugin] ${this.uniH5Version} 不存在\n`);
      return;
    }

    compiler.hooks.environment.tap(this.pluginName, () => {
      try {
        // del.sync(UNI_H5_LIB);
        fs.removeSync(UNI_H5_LIB);
        fs.copySync(sourcePath, UNI_H5_LIB);
      } catch (err) {
        console.warn('[ReplaceUniH5Plugin] err', err);
      }
    });
  }
}


