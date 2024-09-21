import type { ICrossPlatformOptions } from './types';

/**
 * Vite 插件 - 替换跨平台占位符`@TIP_PLATFORM_NAME`
 * @param options.platform - VUE_APP_PLATFORM 对应的名称
 */
export function crossPlatformVitePlugin(options?: ICrossPlatformOptions) {
  const { platform = 'web' } = options || {};

  return {
    name: 'vite-plugin-cross-platform',
    enforce: 'pre',

    transform(source: string) {
      let res = source;

      if (source.indexOf('@TIP_PLATFORM_NAME') !== -1) {
        res = source.replace(/@TIP_PLATFORM_NAME/g, platform);
      }
      return {
        code: res,
        map: null,
      };
    },
  };
}

