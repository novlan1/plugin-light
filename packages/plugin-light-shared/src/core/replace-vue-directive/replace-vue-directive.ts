export function replaceDirective(source: string, list: Array<string>) {
  if (!list.length) return source;

  const reg = new RegExp(`(?<=<[^<]+)v-${list.join('|')}=?[^\\s]*`, 'g');
  const newSource = source.replace(reg, '');

  return newSource;
}
