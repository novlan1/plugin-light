/* eslint-disable @typescript-eslint/no-require-imports */
import * as fs from 'fs';
import * as path from 'path';
import { readCommentJson } from 't-comm';


let rootPath = process.cwd();


/**
 * 返回示意：
 *
 * [
 *  '/Users/mike/Documents/web/src/project/user/views/index/index-home.vue',
    '/Users/mike/Documents/web/src/project/user/packages/views/webview/webview.vue',
    '/Users/mike/Documents/web/src/project/user/views/sche/sche.vue',
    '/Users/mike/Documents/web/src/project/user/views/sche/cycle-set.vue'
    ]
 */
function getAllPagesFromJson(data: { pages: Array<Record<string, any>>, subPackages: Array<Record<string, any>>}) {
  const { pages = [], subPackages = [] } = data;

  const res = pages
    .map(item => item.path)
    .concat(subPackages.map(item => item.pages.map((sub: {path: string}) => path.join(item.root, sub.path))).flat())
    .map(item => `${path.resolve(rootPath, item)}.vue`)
    .filter(item => fs.existsSync(item));

  return res;
}

export function getPagePath() {
  rootPath = path.resolve(process.cwd(), './src', process.env.VUE_APP_DIR || '');
  const pagesJsonPath = path.resolve(rootPath, 'pages.json');
  if (!fs.existsSync(pagesJsonPath)) {
    return [];
  }

  const pagesJson: any = readCommentJson(pagesJsonPath);
  return getAllPagesFromJson(pagesJson);
}

