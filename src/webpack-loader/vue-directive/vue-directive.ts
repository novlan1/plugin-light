import { getOptions } from 'loader-utils';
import type { IVueDirectionOptions } from './types';

export function replaceDirective(source: string, list: Array<string>) {
  if (!list.length) return source;

  const reg = new RegExp(`(?<=<[^<]+)v-${list.join('|')}=?[^\\s]*`, 'g');
  const newSource = source.replace(reg, '');

  return newSource;
}

export function vueDirectiveLoader(this: any, source: string) {
  const options: IVueDirectionOptions = getOptions(this) || {};
  const list = options.list || [];

  return replaceDirective(source, list);
}
