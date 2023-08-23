import { getMainJSPath, getPagesList } from './helper';
import { saveJsonToLog } from '../../helper/index';

function realTraverse(list, map, result, originKey) {
  for (const key of [...list]) {
    if (result.indexOf(key) > -1) {
      continue;
    }
    result.push(key);
    let before = map[key];

    if (before) {
      before = before.filter(item => item !== originKey && list.indexOf(item) <= -1);
      realTraverse(before, map, result, originKey);
    }
  }
}

function excludeSubPackagePages(obj) {
  const pages = getPagesList();
  const mainPath = getMainJSPath();

  return Object.keys(obj).reduce((acc, key) => {
    const isPage = pages.find(item => key.startsWith(item));
    acc[key] = obj[key].filter(item => !(item === mainPath && isPage));
    return acc;
  }, {});
}

function excludeRepeatElements(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = Array.from(new Set(obj[key])).filter(item => item !== key);
    return acc;
  }, {});
}

export function traverseDeps(deps) {
  deps = excludeRepeatElements(deps);
  deps = excludeSubPackagePages(deps);
  const list = Object.keys(deps);
  const newDeps = {};

  for (const item of list) {
    const temp = [...deps[item]];
    const result = [];
    realTraverse([...temp], deps, result, item);
    newDeps[item] = result;
  }
  const res = excludeRepeatElements(newDeps);

  saveJsonToLog(res, 'dispatch-script.deps-traverse-result.json');
  return res;
}
