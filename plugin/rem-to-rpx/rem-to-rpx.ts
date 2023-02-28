import { handleRem } from './css-handler';

function isInWhiteList(whiteList, fileName) {
  for (const item of whiteList) {
    if (fileName.indexOf(item) > -1) {
      console.log(`[REM] ${fileName} 已被跳过处理`);
      return true;
    }
  }
  return false;
}


export class RemToRpxPlugin {
  whiteList: Array<string>;

  constructor(options: {
    whiteList?: Array<string>
  } = {}) {
    const { whiteList } = options || {};
    this.whiteList = whiteList || [];
  }

  apply(complier) {
    if (process.env.UNI_PLATFORM === 'h5') return;

    complier.hooks.emit.tapAsync('RemToRpxPlugin', (compilation, cb) => {
      const fileNames = Object.keys(compilation.assets);
      for (const fileName of fileNames) {
        if (/\.(css|scss|less|wxss)$/.test(fileName) === false) {
          continue;
        }
        if (isInWhiteList(this.whiteList, fileName)) {
          continue;
        }

        const asset = compilation.assets[fileName];
        if (asset._valueIsBuffer) {
          continue;
        }

        const sourceCode = asset.source() || asset._valueAsString || asset._value || asset._cachedSource;
        if (sourceCode != null) {
          // 这里返回null或者undefined会导致编译过程无法结束，所以sourceCode需要判空才给asset.source赋值
          asset.source = () => handleRem(sourceCode);
        }
      }
      cb?.();
    });
  }
}

