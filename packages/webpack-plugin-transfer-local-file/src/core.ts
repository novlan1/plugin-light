const IGNORE_FILE_LIST = [
  'common/vendor.js',
  'common/runtime.js',
  'common/main.js',
];
const isIgnore = (str: string) => IGNORE_FILE_LIST.find(item => str.startsWith(item));


export function replaceSource(source: string, adapterDirs: Array<string>) {
  const replaceReg = new RegExp(`\\.\\./\\.\\./(${adapterDirs.join('|')})(/)(.+?)('|"|/)`, 'g');
  source = source.replace(replaceReg, (...args) => {
    const { 0: origin, 1: localName, 2: slash, 3: innerDir, 4: slashOrQuote } = args;
    const dir = `${localName}${slash}${innerDir}`;
    if (isIgnore(dir)) {
      return origin;
    }
    return `${localName}${slash}${innerDir}${slashOrQuote}`;
  });

  return source;
}
