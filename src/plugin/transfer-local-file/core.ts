const ignoreFileList = ['vendor.js'];
const isIgnore = str => ignoreFileList.find(item => str.startsWith(item));


export function replaceSource(source, adapterDirs) {
  const replaceReg = new RegExp(`\\.\\./\\.\\./(${adapterDirs.join('|')})(/)(.+?)('|"|/)`, 'g');
  source = source.replace(replaceReg, (...args) => {
    const { 0: a, 1: b, 2: c, 3: d, 4: e } = args;
    if (isIgnore(d)) {
      return a;
    }
    return `${b}${c}${d}${e}`;
  });

  return source;
}
