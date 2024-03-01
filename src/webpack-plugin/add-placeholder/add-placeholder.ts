/**
 * 识别动态组件，自动添加对应componentPlaceholder
 */
export class AddPlaceHolderPlugin {
  apply(compiler: any) {
    if (process.env.UNI_PLATFORM !== 'mp-weixin' && process.env.UNI_PLATFORM !== 'mp-qq') return;
    compiler.hooks.emit.tapAsync('AddPlaceHolderPlugin', (compilation: any, callback: Function) => {
      const fileNames = Object.keys(compilation.assets);
      for (const fileName of fileNames) {
        if (/\.(json)$/.test(fileName) === false) {
          continue;
        }
        const asset = compilation.assets[fileName];
        if (asset._valueIsBuffer) {
          continue;
        }
        const compPath = fileName.replace('.json', '').replace('../../', '');
        if (global?.placeholderMap) {
          global.placeholderMap.forEach(((value, key) => {
            if (key.endsWith(compPath)) {
              const sourceCode = asset.source();
              const sourceObj = JSON.parse(sourceCode);
              const usingComponentsObj = sourceObj.usingComponents;
              const placeHolder: Record<string, string> = {};
              let hasPlaceHolder = false;
              value.forEach((item) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const compKey in usingComponentsObj) {
                  if (usingComponentsObj[compKey].indexOf(item.filePath) > -1) {
                    placeHolder[compKey] = 'view';
                    hasPlaceHolder = true;
                  }
                }
              });
              if (hasPlaceHolder) {
                const placeHolderStr = JSON.stringify(placeHolder);
                asset.source = () => sourceCode.replace(/}$/, `,"componentPlaceholder": ${placeHolderStr}\n}`);
              }
            }
          }));
        }
      }
      callback?.();
    });
  }
}

