import { getOptions } from 'loader-utils';
import type { ICrossModuleStyleOptions } from './types';


String.prototype.replaceAll = function (s1: any, s2: any) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};

export function crossModuleStyle(this: any, source: string) {
  const options: ICrossModuleStyleOptions = getOptions(this) || {};
  if (!options.target) {
    return source;
  }

  if (source.indexOf('@TIP_MODULE_STYLE_NAME') !== -1) {
    return source.replaceAll('@TIP_MODULE_STYLE_NAME', options.target);
  }
  return source;
}

