import { replaceDirective } from 'plugin-light-shared';
import type { IRemoveVueDirectionOptions } from './types';


export function removeVueDirectiveVitePlugin(options?: IRemoveVueDirectionOptions) {
  const { list = [] } = options || {};

  return {
    name: 'remove-vue-directive',
    enforce: 'pre',
    transform(source: string, id: string) {
      if (!id.endsWith('.vue')) {
        return {
          code: source,
          map: null,
        };
      }


      return {
        code: replaceDirective(source, list),
        map: null,
      };
    },
  };
}
