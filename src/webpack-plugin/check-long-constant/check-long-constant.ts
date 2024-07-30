import { createLogDir } from '../../helper/index';
import { parseLongConstant } from './core';
import { saveData } from './helper';
import type { FoundItem } from './types';


export class CheckLongConstantPlugin {
  pluginName: String;

  constructor() {
    this.pluginName = 'CheckLongConstantPlugin';

    createLogDir();
  }

  apply(compiler: any) {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    compiler.hooks.emit.tap(this.pluginName, (compilation: any) => {
      try {
        const { assets } = compilation;
        checkLongConstant(assets);
      } catch (err) {
        console.warn('[CheckLongConstantPlugin] err', err);
      }
    });
  }
}


function checkLongConstant(assets: Record<string, any>) {
  const keys = Object.keys(assets);
  const LOG_DATA: Array<{
    file: string,
    data: Array<FoundItem>
  }> = [];

  for (const item of keys) {
    if (item.endsWith('.js')) {
      const source = assets[item].source?.()?.toString();
      const result = parseLongConstant(source);

      LOG_DATA.push({
        file: item,
        data: result,
      });
    }
  }
  saveData(LOG_DATA);
}
