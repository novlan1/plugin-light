import { saveJsonToLog  } from '@plugin-light/shared';
import type { ICustomPreloadOptions, IParsedCustomPreloadOption, IUniRoutes } from './types';

// e.__uniConfig.__webpack_chunk_load__=n.e,t["default"]

function extractAsyncChunks(source: string) {
  // const reg = new RegExp('_webpack_require__.e\\("(.*?)"\\)', 'g');
  if (source.includes('Promise.all')) {
    source = source.replace(/^Promise.all\(\[/, '').replace(/\]\)$/, '');
  }
  const reg = new RegExp('\\w.\\w\\("(.*?)"\\)', 'g');

  const chunks = [];
  let match = reg.exec(source);
  while (match) {
    chunks.push(match[1]);
    match = reg.exec(source);
  }

  return chunks;
}

// eslint-disable-next-line max-len
// const a = 'e.__uniConfig.__webpack_chunk_load__=n.e,t["default"].component("views-home-hor-index",(function(e){var t={component:Promise.all([n.e("default~views-home-hor-index~views-owner-ingame-match-game-list-game-list"),n.e("views-home-hor-index")]).then(function(){return e(n("a772"))}.bind(null,n)).catch(n.oe),delay:__uniConfig["async"].delay,timeout:__uniConfig["async"].timeout};return __uniConfig["async"]["loading"]&&(t.loading={name:"SystemAsyncLoading",render:function(e){return e(__uniConfig["async"]["loading"])}}),__uniConfig["async"]["error"]&&(t.error={name:"SystemAsyncError",render:function(e){return e(__uniConfig["async"]["error"])}}),t})),t["default"].component("views-owner-ingame-match-team-zone-team-zone",(function(e){var t={component:Promise.all([n.e("chunk-2d401669"),n.e("default~views-owner-ingame-match-ai-room-ai-room~views-owner-ingame-match-league-room-league-room~vi~fde6b837"),';
export function extractComponentDeps(source: string) {
  source = source.replace(/\s/g, '').replace(/\.default\.component/g, '["default"].component');
  // eslint-disable-next-line max-len
  // const reg = new RegExp('vue__WEBPACK_IMPORTED_MODULE_4__\\["default"\\].component\\(\'(.*?)\', function \\(resolve\\)\\s+{\\s+var component = {\\s+component: Promise.all\\(([\\s\\S]*)\\[(.*?)\\]\\).then', 'g');
  const reg = new RegExp('\\w\\["default"\\].component\\([\'|"]([\\w-]+)[\'|"],\\(function\\(\\w\\){var\\w={component:(.*?).then', 'g');

  const eventList = [];
  let match = reg.exec(source);

  while (match) {
    const chunks = extractAsyncChunks(match[2]);
    eventList.push({
      name: match[1],
      chunks,
    });
    match = reg.exec(source);
  }

  saveJsonToLog(eventList, 'custom-preload.event-list.json');

  return eventList;
}


export function extractUniRoutes(source: string) {
  const reg = /__uniRoutes=\[([\s\S]+)\],/;
  const inner = source.match(reg)?.[1] || '';
  const compReg = /path:"([^"']+)".*?meta:\{.*?name:"([^"']+)".*?pagePath:"([^"']+)"/g;

  const componentList = [];
  let match = compReg.exec(inner);
  while (match) {
    componentList.push({
      path: match[1],
      name: match[2],
      pagePath: match[3],
    });
    match = compReg.exec(inner);
  }
  saveJsonToLog(componentList, 'custom-preload.component-list.json');
  return componentList;
}


export function flatComponentList(list: Array<IUniRoutes>) {
  return list.reduce((acc: Record<string, any>, item: IUniRoutes) => ({
    ...acc,
    [item.path]: item.name,
  }), {});
}


export function stringifyJson(json: any) {
  return JSON.stringify(json, (k, v) => {
    // 将正则对象转换为正则字符串
    if (v instanceof RegExp) {
      return v.toString();
    }

    return v;
  });
}


export function paresPreloadOptions(options: ICustomPreloadOptions['list'],  uniRoutes: Array<IUniRoutes>): Array<IParsedCustomPreloadOption> {
  const formattedOptions = formatPreloadOptions(options);
  const parsed = getPageBundle(formattedOptions, uniRoutes);
  return parsed;
}

function formatPreloadOptions(options: ICustomPreloadOptions['list']): Array<IParsedCustomPreloadOption> {
  const delay = 0;
  const interval = 1000;
  if (!options) {
    return [];
  }
  const result = options.map((option) => {
    if (Array.isArray(option.pages)) {
      const pages = (option.pages || []).map((page, index) => {
        if (Array.isArray(page)) {
          return {
            page,
            delay: index * interval + delay,
          };
        }
        return {
          page: [page],
          delay: index * interval + delay,
        };
      });

      return {
        ...option,
        pages,
      };
    }

    if (!option.pages) {
      return {
        ...option,
        pages: [],
      };
    }

    return {
      ...option,
      pages: [{
        page: [option.pages],
        delay,
      }],
    };
  });

  return result;
}

function getPageBundle(
  options: Array<IParsedCustomPreloadOption>,
  uniRoutes: Array<IUniRoutes>,
): Array<IParsedCustomPreloadOption> {
  const routesMap = flatComponentList(uniRoutes);

  return options.map((item) => {
    const { pages, condition } = item;
    const parsedPages = (pages || []).reduce((acc: Array<string>, item) => {
      acc.push(...item.page);

      return acc;
    }, []);
    console.log('[parsedPages]', parsedPages);
    let curBundle: string | undefined;


    const key = condition?.hash || condition?.path;
    if (Array.isArray(key)) {
      const temp = key.find(itemKey => !!routesMap[itemKey]);
      if (temp) {
        curBundle = routesMap[temp];
      }
    }
    if (key && typeof key === 'string') {
      curBundle = routesMap[key];
    }
    console.log('[curBundle],', curBundle, key);

    if (curBundle && !parsedPages.includes(curBundle)) {
      return {
        ...item,
        pages: [
          {
            page: [curBundle],
            delay: 0,
          },
          ...(pages || []),
        ],
      };
    }

    return item;
  });
}
