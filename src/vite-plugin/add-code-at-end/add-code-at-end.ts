import type { IAddCodeAtEndOptions, IAddCodeAtEndItem } from './types';


function findTarget(list: Array<IAddCodeAtEndItem>, id: string) {
  const found = list.find((item) => {
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

    transform(source: string, id: string) {
      if (!list.length) return source;


      const target = findTarget(list, id);
      if (!target) return source;
      if (source.includes(target.code))  return source;
      if (set.has(target.id) && target.number === 1) return source;

      set.add(target.id);

      const res = `${source}\n${target?.code || ''}`;

      return {
        code: res,
        map: null,
      };
    },
  };
}

