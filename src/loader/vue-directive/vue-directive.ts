import { getOptions } from 'loader-utils';

export function replaceDirective(source, list) {
  if (!list.length) return source;

  const reg = new RegExp(`(?<=<[^<]+)v-${list.join('|')}=?[^\\s]*`, 'g');
  const newSource = source.replace(reg, '');

  return newSource;
}

export function vueDirectiveLoader(this: any, source) {
  const options: any = getOptions(this) || {};
  const list = options.list || [];

  return replaceDirective(source, list);
}
