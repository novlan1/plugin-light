// import * as fs from 'fs';
// import { normalizePath } from 't-comm';

// export const BASE_SCSS = 'base.scss';


// export function getStyleList(dir: string) {
//   const cssList = fs.readdirSync(dir);
//   const filtered = cssList
//     .filter(item => item.endsWith('scss') && !item.startsWith(BASE_SCSS))
//     .map(item =>  item.replace(/\.scss$/, ''));
//   return filtered;
// }


// export function genInjectContent({
//   styleList,
//   componentName,
//   topElement,
//   dir = '',
// }: {
//   styleList: Array<string>;
//   componentName: string;
//   topElement: string;
//   dir?: string;
// }) {
//   const styleStr = styleList.map((item: string) => `
//   &--type-${item} {
//     @import './${dir}${item}.scss';
//   }`).join('\n');

//   return `
// ${topElement}.${componentName} {
//   ${styleStr}
// }
// `;
// }


// export function getComponentName(dir: string) {
//   const tPath = normalizePath(dir);
//   const reg = /\/([^/]+)\/css/;
//   const match = tPath.match(reg);
//   return match?.[1] || '';
// }
