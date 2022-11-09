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
    if (item.indexOf('node-modules') > -1) {
      const source = assets[item].source?.()?.toString();
      const cwd =  process.cwd();
      if (source.indexOf(cwd) === -1) continue;

      global.webpackJsonp = [];
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require(source);
      const comps = global.webpackJsonp?.[0]?.[2];
      if (!comps) continue;

      const key = Object.keys(comps)[0];
      if (!key) continue;

      const newSource = replaceAbsolutePath({
        source,
        path: cwd,
        key,
      });

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
