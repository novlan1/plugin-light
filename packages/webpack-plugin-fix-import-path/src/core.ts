import path from 'path';


/**
 * 像 require('../common/runtime.js'); 这种引用路径是有问题的，
 * 应该是 ../../../common/runtime.js
 *
 */
export function fixImportPath({
  source,
  filePath,
  root,
  assets,
  handleList,
}: {
  source: string;
  filePath: string;
  root: string;
  assets: Record<string, any>;
  handleList: Array<string>;
}) {
  if (!handleList.length) {
    return {
      newSource: source,
    };
  }


  const reg = new RegExp(`require\\((?:'|")([./]*)(${handleList.join('|')})(?:'|")\\)`, 'g');
  const logData = [];

  let match = reg.exec(source);
  if (!match) {
    return {
      newSource: source,
    };
  }

  let newSource = source;


  while (match) {
    const { 0: origin, 1: relative, 2: innerFile } = match;

    let curPath = path.resolve(filePath, relative, '../');
    if (!relative) {
      // 绝对路径
      curPath = path.dirname(curPath);
    }

    const curTargetRelative = getCurTargetRelative({
      relative,
      innerFile,
      filePath,
    });

    if (!curTargetRelative || !assets[curTargetRelative]) {
      const targetFile = findRealFile({
        filePath: curPath,
        targetFile: innerFile,
        root,
        assets,
      });

      if (targetFile) {
        let relative = path.relative(path.dirname(filePath), targetFile);

        if (relative) {
          if (!relative.startsWith('.')) {
            relative = `./${relative}`;
          }

          const target = `require('${relative}')`;
          newSource = newSource.replace(origin, target);

          logData.push({
            origin,
            target,
            targetFile,
          });
        }
      }
    } else {
      logData.push({
        origin,
        hold: true,
        curTargetRelative,
      });
    }

    match = reg.exec(newSource);
  }


  return { newSource, logData };
}


function getCurTargetRelative({
  relative,
  innerFile,
  filePath,
}: {
  relative: string;
  innerFile: string;
  filePath: string;
}) {
  let curTargetRelative = '';
  if (relative) {
    const curTarget = path.resolve(path.dirname(filePath), `${relative}${innerFile}`);
    curTargetRelative = path.relative(path.dirname(filePath), curTarget);
  }

  return curTargetRelative;
}


function findRealFile({
  filePath,
  targetFile,
  root,
  assets,
}: {
  filePath: string;
  targetFile: string;
  root: string;
  assets: Record<string, any>;
}): string {
  if (filePath.length < root.length) return '';

  const dir = path.dirname(filePath);
  const newFilePath = path.resolve(dir, targetFile);
  const newFileRelativePath = path.relative(root, newFilePath);

  if (assets[newFileRelativePath]) {
    return newFilePath;
  }

  return findRealFile({
    filePath: dir,
    targetFile,
    root,
    assets,
  });
}
