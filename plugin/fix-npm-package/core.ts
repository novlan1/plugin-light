export function replaceAbsolutePath({
  source,
  path,
  key,
}) {
  const reg = new RegExp(`(?<=__webpack_require__\\(")(${path}.*?)(?="\\))`);
  const newSource = source.replace(reg, key);
  return newSource;
}


export function fixNpmPackage(assets) {
  const keys = Object.keys(assets);
  for (const item of keys) {
    if (item.indexOf('node-modules') > -1 && item.endsWith('.js')) {
      const source = assets[item].source?.()?.toString();
      const cwd =  process.cwd();
      if (source.indexOf(cwd) === -1) continue;

      global.webpackJsonp = [];
      // eslint-disable-next-line no-eval
      eval(source);
      const comps = global.webpackJsonp?.[0]?.[1];
      if (!comps) continue;

      const key = Object.keys(comps)[0];
      if (!key) continue;

      const newSource = replaceAbsolutePath({
        source,
        path: cwd,
        key,
      });
      console.log(`FIX NPM PACKAGE: 将 ${item} 中的绝对路径替换为${key}`);
      assets[item] = {
        source() {
          return newSource;
        },
        size() {
          return newSource.length;
        },
      };
    }
  }
}
