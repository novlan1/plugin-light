import { replaceAllPolyfill } from 't-comm';
import { replaceSource } from './helper';
import type { IReplaceContentOptions, IReplaceList } from './types';


replaceAllPolyfill();

function getReplaceMap(replaceList: IReplaceList) {
  return replaceList.reduce((acc: Record<any, any>, item) => {
    const { from, to, files = [] } = item;

    files.forEach((file: any) => {
      if (acc[file]) {
        acc[file].push({
          from,
          to,
        });
      } else {
        acc[file] = [{
          from,
          to,
        }];
      }
    });

    return acc;
  }, {});
}

export class ReplaceContentPlugin {
  replaceReg: RegExp;
  fileNameReg: RegExp;
  replaceList: IReplaceList;
  replaceMap: Record<any, any>;

  constructor(options: IReplaceContentOptions) {
    const { replaceReg, fileNameReg, replaceList = [] } = options;
    this.replaceReg = replaceReg;
    this.fileNameReg = fileNameReg;
    this.replaceList = replaceList;

    if (replaceReg && fileNameReg) {
      this.replaceList = this.replaceList.concat([{
        files: [fileNameReg],
        from: replaceReg,
        to: '',
      }]);
    }

    this.replaceMap = getReplaceMap(this.replaceList);
  }

  apply(complier: any) {
    complier.hooks.emit.tapAsync('ReplaceContentPlugin', (compilation: any, cb: Function) => {
      try {
        this.doReplace(compilation, cb);
      } catch (err) {
        console.warn('[ReplaceContentPlugin] err: ', err);
      }
    });
  }

  doReplace(compilation: any, cb: Function) {
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

