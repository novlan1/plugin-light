import { vLazyCore } from '@plugin-light/shared';

export function transformVLazyVitePlugin() {
  return {
    name: 'transform-v-lazy',
    enforce: 'pre',
    transform(source: string, id: string) {
      if (!id.endsWith('.vue')) {
        return {
          code: source,
          map: null,
        };
      }

      return {
        code: vLazyCore(source),
        map: null,
      };
    },
  };
}
