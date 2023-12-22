import * as fs from 'fs';
import { normalizePath } from 't-comm';

export const BASE_SCSS = 'base.scss';


export function getStyleList(dir) {
  const cssList = fs.readdirSync(dir);
  const filtered = cssList
    .filter(item => item.endsWith('scss') && !item.startsWith(BASE_SCSS))
    .map(item =>  item.replace(/\.scss$/, ''));
  return filtered;
}


export function genInjectContent({
  styleList,
  componentName,
  topElement,
  dir = '',
}) {
  const styleStr = styleList.map(item => `
  &--type-${item} {
    @import './${dir}${item}.scss';
  }`).join('\n');

  return `
${topElement}.${componentName} {
  ${styleStr}
}
`;
}


export function getComponentName(dir) {
  const tPath = normalizePath(dir);
  const reg = /\/([^/]+)\/css/;
  const match = tPath.match(reg);
  return match?.[1] || '';
}
