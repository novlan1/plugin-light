import { replaceAllPolyfill } from 't-comm';
import { replaceSource } from './helper';


replaceAllPolyfill();

// function replaceContent({ content, reg, fileName }) {
//   if (reg.test(content)) {
//     console.log('[ReplaceContentPlugin] 处理了文件：', fileName);
//     return content.replaceAll(reg, '');
//   }

//   return content;
// }

function getReplaceMap(replaceList) {
  return replaceList.reduce((acc, item) => {
    const { from, to, files } = item;

    if (acc[files]) {
      acc[files].push({
        from,
        to,
      });
    } else {
      acc[files] = [{
        from,
        to,
      }];
    }
    return acc;
  }, {});
}

export class ReplaceContentPlugin {
  replaceReg: RegExp;
  fileNameReg: RegExp;
  replaceList: Array<any>;
  replaceMap: Record<any, any>;

  constructor(options) {
    const { replaceReg, fileNameReg, replaceList = [] } = options;
    this.replaceReg = replaceReg;
    this.fileNameReg = fileNameReg;
    this.replaceList = replaceList;

    if (replaceReg && fileNameReg) {
      this.replaceList = this.replaceList.concat({
        files: fileNameReg,
        from: replaceReg,
        to: '',
      });
    }

    this.replaceMap = getReplaceMap(this.replaceList);
  }

  apply(complier) {
    complier.hooks.emit.tapAsync('ReplaceContentPlugin', (compilation, cb) => {
      try {
        this.doReplace(compilation, cb);
      } catch (err) {
        console.log('[ReplaceContentPlugin] err: ', err);
      }
    });
  }

  doReplace(compilation, cb) {
    const { replaceList } = this;
    const fileNames = Object.keys(compilation.assets);
    for (const fileName of fileNames) {
      // if (!fileNameReg.test(fileName)) {
      //   continue;
      // }

      const asset = compilation.assets[fileName];
      if (asset._valueIsBuffer) {
        continue;
      }

      const sourceCode = asset.source() || asset._valueAsString || asset._value || asset._cachedSource;

      if (sourceCode != null) {
        // 这里返回null或者undefined会导致编译过程无法结束，所以sourceCode需要判空才给asset.source赋值
        asset.source = () => replaceSource({
          source: sourceCode,
          replaceList,
          file: fileName,
        });
        // replaceContent({
        //   content: sourceCode,
        //   reg: replaceReg,
        //   fileName,
        // });
      }
    }
    cb?.();
  }
}

