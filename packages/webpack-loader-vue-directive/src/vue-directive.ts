import { getOptions } from 'loader-utils';
import { replaceDirective } from '@plugin-light/shared';
import type { IVueDirectionOptions } from './types';


export function vueDirectiveLoader(this: any, source: string) {
  const options: IVueDirectionOptions = getOptions(this) || {};
  const list = options.list || [];

  return replaceDirective(source, list);
}
