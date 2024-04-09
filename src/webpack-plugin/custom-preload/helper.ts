import { saveJsonToLog  } from '../../helper/index';

// e.__uniConfig.__webpack_chunk_load__=n.e,t["default"]

function extractAsyncChunks(source: string) {
  // const reg = new RegExp('_webpack_require__.e\\("(.*?)"\\)', 'g');
  if (source.includes('Promise.all')) {
    source = source.replace(/^Promise.all\(\[/, '').replace(/\]\)$/, '');
  }
  const reg = new RegExp('n.e\\("(.*?)"\\)', 'g');

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
  // eslint-disable-next-line max-len
  // const reg = new RegExp('vue__WEBPACK_IMPORTED_MODULE_4__\\["default"\\].component\\(\'(.*?)\', function \\(resolve\\)\\s+{\\s+var component = {\\s+component: Promise.all\\(([\\s\\S]*)\\[(.*?)\\]\\).then', 'g');
  const reg = new RegExp('t\\["default"\\].component\\([\'|"](.*?)[\'|"],\\s*\\(function\\(e\\){var\\s*t={component:(.*?).then', 'g');

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

  // console.log(reg.test(source));
  console.log('eventList', eventList);

  saveJsonToLog(eventList, 'pages-chunk.json');

  return eventList;
}

// extractComponentDeps(a);
export function stringifyJson(json: any) {
  return JSON.stringify(json, (k, v) => {
    // 将正则对象转换为正则字符串
    if (v instanceof RegExp) {
      return v.toString();
    }

    return v;
  });
}

