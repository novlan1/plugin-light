import { saveJsonToLog } from './index';

const LOG_KEY = 'LOADER_LOGS';

export function saveLoaderLog() {
  const loaderLogs = global[LOG_KEY] as {
    [k: string]: any
  };

  if (!loaderLogs) return;

  Object.keys(loaderLogs).forEach((file) => {
    saveJsonToLog(loaderLogs[file], file);
  });
}

export function recordLoaderLog(file, content) {
  if (!global[LOG_KEY]) {
    global[LOG_KEY] = {};
  }
  if (!global[LOG_KEY][file]) {
    global[LOG_KEY][file] = [];
  }
  global[LOG_KEY][file].push(content);
}
