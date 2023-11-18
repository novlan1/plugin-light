import * as fs from 'fs';

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
  const match = dir.match(/\/([^/]+)\/css/);
  return match?.[1] || '';
}
