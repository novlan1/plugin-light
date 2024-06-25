
function realTraverse(
  parent: Array<string>,
  deps: Record<string, Array<string>>,
  result: Array<string>,
  child: string,
) {
  for (const key of [...parent]) {
    if (result.indexOf(key) > -1) {
      continue;
    }
    result.push(key);
    let before = deps[key];

    if (before) {
      before = before.filter(ancestor => ancestor !== child && parent.indexOf(ancestor) <= -1);
      realTraverse(before, deps, result, child);
    }
  }
}

function excludeSubPackagePages({
  deps,
  pages,
  mainPath,
}: {
  deps: Record<string, Array<string>>;
  pages: Array<string>;
  mainPath: string;
}) {
  return Object.keys(deps).reduce((acc: Record<string, Array<string>>, key) => {
    const isPage = pages.find(item => key.startsWith(item));

    if (isPage) {
      acc[key] = deps[key].filter(item => (item !== mainPath));
    } else {
      acc[key] = deps[key];
    }

    // acc[key] = deps[key].filter(item => (item !== mainPath || !isPage));
    return acc;
  }, {});
}

function excludeRepeatElements(deps: Record<string, Array<string>>) {
  return Object.keys(deps).reduce((acc: Record<string, Array<string>>, key) => {
    acc[key] = Array.from(new Set(deps[key])).filter(item => item !== key);
    return acc;
  }, {});
}

export function traverseDeps({
  deps,
  pages,
  mainPath,
}: {
  deps: Record<string, Array<string>>;
  pages: Array<string>;
  mainPath: string;
}) {
  deps = excludeRepeatElements(deps);
  deps = excludeSubPackagePages({ deps, pages, mainPath });

  const list = Object.keys(deps);
  const newDeps: Record<string, Array<string>> = {};

  for (const child of list) {
    const parent = [...deps[child]];
    const result: Array<string> = [];

    realTraverse([...parent], deps, result, child);
    newDeps[child] = result;
  }
  const res = excludeRepeatElements(newDeps);

  return res;
}
