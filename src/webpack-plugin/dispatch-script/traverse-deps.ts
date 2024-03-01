import { getMainJSPath, getPagesList } from './helper';
import { saveJsonToLog } from '../../helper/index';

function realTraverse(
  list: Array<string>,
  map: Record<string, Array<string>>,
  result: Array<string>,
  originKey: string,
) {
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

function excludeSubPackagePages(obj: Record<string, Array<string>>) {
  const pages = getPagesList();
  const mainPath = getMainJSPath();

  return Object.keys(obj).reduce((acc: Record<string, Array<string>>, key) => {
    const isPage = pages.find(item => key.startsWith(item));
    acc[key] = obj[key].filter(item => !(item === mainPath && isPage));
    return acc;
  }, {});
}

function excludeRepeatElements(obj: Record<string, Array<string>>) {
  return Object.keys(obj).reduce((acc: Record<string, Array<string>>, key) => {
    acc[key] = Array.from(new Set(obj[key])).filter(item => item !== key);
    return acc;
  }, {});
}

export function traverseDeps(deps: Record<string, Array<string>>) {
  deps = excludeRepeatElements(deps);
  deps = excludeSubPackagePages(deps);
  const list = Object.keys(deps);
  const newDeps: Record<string, Array<string>> = {};

  for (const item of list) {
    const temp = [...deps[item]];
    const result: Array<string> = [];
    realTraverse([...temp], deps, result, item);
    newDeps[item] = result;
  }
  const res = excludeRepeatElements(newDeps);

  saveJsonToLog(res, 'dispatch-script.deps-traverse-result.json');
  return res;
}
