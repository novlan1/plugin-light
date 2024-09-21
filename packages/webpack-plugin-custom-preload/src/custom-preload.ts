import { saveJsonToLog, updateAssetSource } from '@plugin-light/shared';
import { extractComponentDeps, extractUniRoutes, stringifyJson, paresPreloadOptions } from './helper';

import type { ICustomPreloadOptions, IUniRoutes } from './types';


export class CustomPreloadPlugin {
  pluginName = 'CustomPreloadPlugin';
  moduleList = [];
  mainChunkFileName = 'index.js';
  pageChunkList: Array<{name: string;chunks: Array<string>;}> = [];
  uniRoutes: Array<IUniRoutes> = [];
  customPreloadOptions: ICustomPreloadOptions = {};


  constructor(options: ICustomPreloadOptions) {
    if (Array.isArray(options.list)) {
      this.customPreloadOptions = options;
    }
  }
  apply(compiler: any) {
    if (!this.customPreloadOptions.list?.length) {
      return;
    }

    compiler.hooks.compilation.tap(this.pluginName, (compilation: any) => {
      compilation.hooks.chunkAsset.tap(this.pluginName, (chunk: any, filename: string) => {
        if (chunk.name === 'index') {
          this.mainChunkFileName = filename;
        }
      });
    });

    compiler.hooks.emit.tap(this.pluginName, (compilation: any) => {
      const { assets } = compilation;
      const mainChunkFile = assets[this.mainChunkFileName];
      const source = mainChunkFile.source();

      const pageChunkList = extractComponentDeps(source);
      this.uniRoutes = extractUniRoutes(source);
      this.pageChunkList = pageChunkList;

      const insertCode = this.getAllPreloadScripts();
      this.updateHtml(compilation, insertCode);
    });
  }

  getAllPreloadScripts() {
    const parsedOptions = paresPreloadOptions(this.customPreloadOptions.list, this.uniRoutes);
    const preloadPageList = parsedOptions?.reduce((acc: Array<string>, item) => {
      acc.push(...(item.pages || []).reduce((ac: Array<string>, it) => {
        ac.push(...it.page);
        return ac;
      }, []));

      return acc;
    }, []);
    saveJsonToLog(preloadPageList, 'custom-preload.preload-page-list.json');

    const chunkMap = this.pageChunkList.filter(item => preloadPageList?.includes(item.name))
      .reduce((acc: any, item) => {
        acc[item.name] = item.chunks;
        return acc;
      }, {});

    if (!Object.keys(chunkMap).length) {
      return '';
    }
    // var chunkMap = {
    //   'views-match-match-detail-index': [ 'chunk-49f54b64', 'chunk-17956c4c', 'views-match-match-detail-index'],
    //   'views-match-match-detail-match-detail': [ 'chunk-49da847a', 'views-match-match-detail-match-detail'],
    //   'views-other-album-event-theme': [ 'chunk-49f54b64', 'views-other-album-event-theme'],
    //   'views-battle-room-room-quick': [ 'chunk-49da847a', 'views-battle-room-room-quick'],
    // };

    const insertCode = `<script>(function(){var chunkMap = ${JSON.stringify(chunkMap)};var preloadList = ${stringifyJson(parsedOptions || [])};var hash = window.location.hash;
main();
function main() {
  setTimeout(() => {
    try {
      load();
    } catch(err) {}
  },10);
}
function load() {
  for(var i = 0; i< preloadList.length;i++){
    var item = preloadList[i];
    var hash = item.condition && item.condition.hash;
    var conditionPath = item.condition && item.condition.path;
    var evalHash = '';
    try {
      evalHash = eval(hash);
    } catch(err) {}
    if (hash) {
      if ((typeof hash === 'string' && location.hash === hash) || (
        typeof evalHash === 'object' && evalHash.test && evalHash.test(location.hash)
      ) || (Object.prototype.toString.call(hash) === '[object Array]' && hash.indexOf(location.hash) > -1 )) {
        loadScript(item.pages);
        break;
      }
    }

    if (conditionPath && location.pathname) {
      var currentPath = '/' + location.pathname.split('/').slice(2).join('/');

      if ((typeof conditionPath === 'string' && conditionPath === currentPath) || (
        Object.prototype.toString.call(conditionPath) === '[object Array]' && conditionPath.indexOf(currentPath) > -1)
      ) {
        loadScript(item.pages);
        break;
      }
    }
  }
}
function getPageChunks(pages) {
  var result = [];
  for (var i = 0; i< pages.length;i++) {
    result = result.concat(chunkMap[pages[i] || []]);
  }
  return result;
}
function loadScript(pages) {
  var scripts = [];
  for (var i =0;i<pages.length;i++) {
    var page = pages[i];
    var script = getPageChunks(page.page || []);
    if (script && script.length) {
      scripts = scripts.concat({
        script: script,
        delay: page.delay,
      });
    }
  }
  for (var j = 0; j < scripts.length; j++) {
    (function (j) {
      setTimeout(() => {
        batchLoadScript(scripts[j].script);
      }, scripts[j].delay || 0);
    })(j);
  }
}
function batchLoadScript(scripts) {
  for (var i = 0; i < scripts.length; i++) {
    realLoadScript(scripts[i]);
  }
}
function realLoadScript(target) {
  if (!target) { return; }
  var src = window.jsonpScriptSrc && window.jsonpScriptSrc(target);

  if (!src || src.indexOf('.undefined.js') > -1) { return; }
  var head = document.querySelector('head');
  if (!head) { return; }
  var newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = src;

  head.appendChild(newScript);
}
})()</script>`;

    return insertCode;
  }

  updateHtml(compilation: any, insertCode: string) {
    const { assets } = compilation;
    const key = 'index.html';
    if (!assets[key] || !insertCode) return;


    const source = assets[key].source().toString();
    const idx = source.lastIndexOf('</head>');
    const newSource = source.slice(0, idx) + insertCode + source.slice(idx);

    updateAssetSource(assets, key, newSource);
  }
}


// [
//   {
//     condition: '#/',
//     pages: ['views-home-hor-index'],
//   },
// ];
