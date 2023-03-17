import { replaceAllPolyfill } from 't-comm';

replaceAllPolyfill();

function replaceContent({ content, reg, fileName }) {
  if (reg.test(content)) {
    console.log('[ReplaceContentPlugin] 处理了文件：', fileName);
  }
  return content.replaceAll(reg, '');
}

export class ReplaceContentPlugin {
  replaceReg: RegExp;
  fileNameReg: RegExp;

  constructor(options) {
    const { replaceReg, fileNameReg } = options;
    this.replaceReg = replaceReg;
    this.fileNameReg = fileNameReg;
  }

  apply(complier) {
    const { fileNameReg, replaceReg } = this;
    complier.hooks.emit.tapAsync('ReplaceContentPlugin', (compilation, cb) => {
      const fileNames = Object.keys(compilation.assets);
      for (const fileName of fileNames) {
        if (!fileNameReg.test(fileName)) {
          continue;
        }

        const asset = compilation.assets[fileName];
        if (asset._valueIsBuffer) {
          continue;
        }

        const sourceCode = asset.source() || asset._valueAsString || asset._value || asset._cachedSource;

        if (sourceCode != null) {
          // 这里返回null或者undefined会导致编译过程无法结束，所以sourceCode需要判空才给asset.source赋值
          asset.source = () => replaceContent({
            content: sourceCode,
            reg: replaceReg,
            fileName,
          });
        }
      }
      cb?.();
    });
  }
}

