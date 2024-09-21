import path from 'path';
import fs from 'fs';

import { copyDir } from 't-comm';

import type { IGenMpPluginPlaygroundOptions } from './types';


const MP_PLUGIN_PLAYGROUND_NAME = 'mp-plugin-public';


export class GenMpPluginPlaygroundPlugin {
  outputDir = process.env.UNI_OUTPUT_DIR || '';
  playgroundDir = path.resolve(process.env.UNI_INPUT_DIR || '', MP_PLUGIN_PLAYGROUND_NAME);
  options?: IGenMpPluginPlaygroundOptions;


  constructor(options: IGenMpPluginPlaygroundOptions) {
    this.options = options;

    if (options?.outputDir) {
      this.outputDir = options.outputDir;
    }
    if (options?.playgroundDir) {
      this.playgroundDir = options.playgroundDir;
    }
  }

  apply(compiler: any) {
    if (!this.options?.pluginName) {
      return;
    }

    compiler.hooks.done.tap('GenMpPluginPlaygroundPlugin', () => {
      this.modifyRef();
    });
  }


  modifyRef() {
    const { playgroundDir, outputDir } = this;
    if (!playgroundDir || !outputDir) return;

    const files = fs.readdirSync(playgroundDir);


    files.forEach((file) => {
      const cur = `${playgroundDir}/${file}`;
      const target = path.resolve(this.outputDir, file);

      if (fs.lstatSync(cur).isDirectory()) {
        copyDir(cur, target);
      } else {
        fs.copyFileSync(cur, target);
      }
    });
  }
}

