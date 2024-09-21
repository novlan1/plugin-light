import type { IAddCodeAtEndOptions, IAddCodeAtEndItem } from './types';


function findTarget(list: Array<IAddCodeAtEndItem>, id: string) {
  const found = list.find((item) => {
    if (item.id instanceof RegExp) {
      return item.id.test(id);
    }

    if (item.exact) {
      return item.id === id;
    }

    return id.indexOf(item.id) > -1;
  });

  return found;
}

const set = new Set();

export function addCodeAtEndVitePlugin(options?: IAddCodeAtEndOptions) {
  const { list = [] } = options || {};


  return {
    name: 'vite-plugin-add-code-at-end',
    enforce: 'pre',
    transform(source: string, id: string) {
      if (!list.length) {
        return {
          code: source,
          map: null,
        };
      }


      const target = findTarget(list, id);
      if (!target || source.includes(target.code) || (set.has(target.id) && target.number === 1)) {
        return {
          code: source,
          map: null,
        };
      }

      set.add(target.id);

      const res = `${source}\n${target?.code || ''}`;
      console.log('[addCodeAtEndVitePlugin] changed: ', id);

      return {
        code: res,
        map: null,
      };
    },
  };
}

