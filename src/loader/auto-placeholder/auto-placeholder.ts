/**
 * 记录每个页面的动态组件
 */
export function autoPlaceLoader(source = '') {
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin' && process.env.VUE_APP_PLATFORM !== 'mp-qq') {
    return source;
  }
  const reg = new RegExp(/(([a-zA-Z]+?)\(resolve\)(?:\s*?)\{(?:\n\s*)require\(\['(.*?)'\],(?:\s*?)resolve\);(?:\n\s*)\})+/, 'g');
  const match = [...source.matchAll(reg)];
  if (!match?.length) {
    return source;
  }
  const compList = match.map((item) => {
    const name = item?.[2];
    let filePath = '';
    if (item?.[3]) {
      filePath = item[3];
      if (filePath.startsWith('src/')) {
        filePath = filePath.replace('src/', '/');
      } else if (filePath.startsWith('./')) {
        filePath = filePath.replace('./', '/');
      } else if (filePath.startsWith('../../')) {
        filePath = filePath.replace('../../', '/');
      } else if (filePath.startsWith('../')) {
        filePath = filePath.replace('../', '/');
      }
      if (filePath.endsWith('.vue')) {
        filePath = filePath.replace('.vue', '');
      }
    }
    return {
      name,
      filePath,
    };
  });
  if (!global?.placeholderMap) {
    global.placeholderMap = new Map();
  }
  // @ts-ignore
  global.placeholderMap.set(this.resourcePath.replace('.vue', ''), compList);
  return source;
}


