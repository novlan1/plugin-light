import { shouldUseLoader, PLATFORMS_MP } from '../../helper/loader-options';


/**
 * 替换vue文件key的表示，以解决转换报错
 * 比如将 :key="'type' + index" 转为 :key="type-${index}"
 * @example
 * ```ts
 * const testA  = ':key="\'templateList\' + index "';
   transformKey(testA);
   const testB  = ':key="index + \'templateList\'"';
   transformKey(testB);
   const testC = ' :key="memberIndex + \'blueindex\' "';
   transformKey(testC);
 * ```
 */
export function transformKey(this: any, source) {
  if (!shouldUseLoader.call(this, PLATFORMS_MP)) return source;

  const re = /:key="'(\w+)'\s*\+\s*(\w+)\s*"/g;
  const reBack = /:key="(\w+)\s*\+\s*'(\w+)'\s*"/g;

  if (re.test(source)) {
    return source.replace(re, (a, b, c) => {
      const realKey = `\`${b}-$\{${c}}\``;
      const res = `:key="${realKey}"`;
      return res;
    });
  }

  if (reBack.test(source)) {
    return source.replace(reBack, (a, b, c) => {
      const realKey = `\`${c}-$\{${b}}\``;
      const res = `:key="${realKey}"`;
      return res;
    });
  }

  return source;
}


