import * as path from 'path';
import { parseComponent } from 'vue-template-compiler';
import { readFileSync, traverseFolder } from 't-comm';
import { getHtmlClasses } from './parse-class';
import { TIP_STYLE_NAME } from './helper';

function getCssFilePath(file: string, vuePath: string) {
  if (file === TIP_STYLE_NAME) {
    return file;
  }

  if (file.startsWith('.')) {
    return path.resolve(path.dirname(vuePath), file);
  }
  if (file.startsWith('src')) {
    return path.resolve(process.cwd(), file);
  }
  return file;
}


function parseVue(file: string) {
  const content = readFileSync(file);
  const res = parseComponent(content);
  const result = res.styles.map(item => item.src)
    .filter(item => item)
    .map(item => getCssFilePath(item!, file));

  return result;
}


function checkCss(cssFile: string) {
  const firstDir = path.dirname(cssFile);
  const secondDir = path.resolve(firstDir, '..');

  const result: Array<string> = [];
  traverseFolder(checkVue.bind(null, cssFile, result), secondDir);

  const classResult: Array<string> = [];
  result.map((item) => {
    classResult.push(...getHtmlClasses(item));
  });


  return classResult;
}


function checkVue(cssFile: string, vueResult: Array<string>, filePath: string) {
  if (!filePath.endsWith('.vue')) {
    return;
  }
  const result = parseVue(filePath);

  if (result.includes(cssFile) || result.includes(TIP_STYLE_NAME)) {
    vueResult.push(filePath);
  }
}


export { checkCss };
