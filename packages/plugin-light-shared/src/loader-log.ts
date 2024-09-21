import { saveJsonToLog } from './helper';

const LOG_KEY = 'LOADER_LOGS';

type IGlobal = typeof global & {[LOG_KEY]: any};


export function saveLoaderLog() {
  const loaderLogs = (global as IGlobal)[LOG_KEY] as {
    [k: string]: any
  };

  if (!loaderLogs) return;

  Object.keys(loaderLogs).forEach((file) => {
    saveJsonToLog(loaderLogs[file], file);
  });
}

export function recordLoaderLog(file: string, content: any) {
  if (!(global as IGlobal)[LOG_KEY]) {
    (global as IGlobal)[LOG_KEY] = {};
  }
  if (!(global as IGlobal)[LOG_KEY][file]) {
    (global as IGlobal)[LOG_KEY][file] = [];
  }
  (global as IGlobal)[LOG_KEY][file].push(content);
}
