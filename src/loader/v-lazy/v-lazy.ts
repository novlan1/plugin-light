import { getOptions } from 'loader-utils';
import { shouldUseLoader, PLATFORMS_MP } from '../../helper/loader-options';
import { vLazyCore } from './core';


/**
 * 替换vue模板中的v-lazy，比如
 * <img v-lazy="img"> => <img :src="img">
 *
 * 如果提供 options.urlHandler，则用 urlHandler 包裹，比如：
 * <img v-lazy="img"> => <img :src="getCompressUrl(img)">
 *
 * 如果提供 size 和 urlHandler，则向 urlHandler 传递 size 参数，比如：
 * <img v-lazy="img" size="50"> => <img :src="getCompressUrl(img, 50, 50)">
 *
 *
 * 以下几种size都是有效的：
 * <img v-lazy="src" size="50">
 * <img v-lazy="src" data-size="50">
 * <img v-lazy="src" width="50" height="100">
 * <img v-lazy="src" data-width="50" data-height="100">
 */
export function lazyLoader(this: any, source) {
  if (!shouldUseLoader.call(this, PLATFORMS_MP)) return source;

  const options = getOptions(this) || {};

  const newSource = vLazyCore(source, options);
  return newSource;
}


