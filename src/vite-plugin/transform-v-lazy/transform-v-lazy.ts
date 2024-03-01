import { vLazyCore } from '../../webpack-loader/v-lazy/core';

export function transformVLazyVitePlugin() {
  return {
    name: 'transform-v-lazy',
    enforce: 'pre',
    transform(source: string) {
      return {
        code: vLazyCore(source),
        map: null,
      };
    },
  };
}
