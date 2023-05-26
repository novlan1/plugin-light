import { replaceAllPolyfill } from 't-comm';
import { getRelativePath } from '../../helper';
import { recordLoaderLog } from '../../helper/loader-log';
import { shouldUseLoader, PLATFORMS_MP } from '../../helper/loader-options';


/**
 * 替换动态组件
 *
 * @example
 *
 * components: {
 *   xxComp(resolve) {
 *     require(['xx.comp'], resolve);
 *   },
 * }
 *
 *  // 会被转为：
 * import xxComp from 'xx.comp';
 *
 * components: {
 *   xxComp,
 *  }
 */
export default function transformDynamicComp(this: any, source = '') {
  replaceAllPolyfill();
  if (!shouldUseLoader.call(this, PLATFORMS_MP)) return source;

  source = source.replaceAll(/\(\)\s*=>\s*import\('.*?'\)/, '1');

  const reg = new RegExp(/(([a-zA-Z]+?)\(resolve\)(?:\s*?)\{(?:\n\s*)require\(\['(.*?)'\],(?:\s*?)resolve\);(?:\n\s*)\})+/, 'g');
  const match = [...source.matchAll(reg)];
  if (!match?.length) return source;
  const compList = match.map(item => ({
    name: item[2],
    file: item[3],
  }));
  const importStr = compList.reduce((acc, item) => {
    acc += `import ${item.name} from '${item.file}';\n`;
    return acc;
  }, '');


  const scriptReg = new RegExp('<script>');
  let newSource = source.replace(scriptReg, () => `<script>\n${importStr}`);

  for (const item of compList) {
    const { name, file } = item;
    const compReg = new RegExp(`${name}\\(resolve\\)\\s*\\{\\n\\s*require\\(\\['(${file})'\\],\\s*resolve\\);?\\n*\\s*\\}`);
    newSource = newSource.replace(compReg, () => `${name}`);
  }

  // @ts-ignore
  const { resourcePath } = this;

  recordLoaderLog('transform-dynamic-comp.json', {
    file: getRelativePath(resourcePath),
    component: compList.map(item => item.name).join(','),
  });
  return newSource;
}


