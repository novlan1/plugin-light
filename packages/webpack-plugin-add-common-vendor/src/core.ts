import * as path from 'path';
import { updateAssetSource, saveJsonToLog } from '@plugin-light/shared';

let called = false;


function getPageSubPackage({
  pageSet,
  subPackages,
}: {
  pageSet: string[];
  subPackages: string[];
}) {
  const result = pageSet.map((page) => {
    const curSubPackage = subPackages.find(subPackage => page.startsWith(`${subPackage}/`));

    return {
      page,
      subPackage: curSubPackage,
    };
  });

  return result;
}


export function addCommonVendorCore({
  pageSet,
  assets,
  subPackages,
  outputDir,
  postFix = '.js',
}: {
  pageSet: string[];
  assets: Record<string, any>;
  subPackages: string[],
  outputDir: string;
  postFix?: string;
}) {
  if (called && process.env.NODE_ENV === 'production') {
    return ;
  }
  called = true;

  const pageSubPackages = getPageSubPackage({
    pageSet,
    subPackages,
  });

  const logList: Array<{
    file: string;
    insertCode: string;
    subPackage: string;
  }> = [];
  for (const item of pageSubPackages) {
    const file = `${item.page}${postFix}`;
    const filePath = path.resolve(outputDir, file);

    if (!item.subPackage) {
      continue;
    }

    const vendor = [item.subPackage, 'common/vendor.js'].join('/');
    const vendorPath = path.resolve(outputDir, vendor);

    if (!assets[vendor]) {
      continue;
    }

    const vendorRelativePath = path.relative(path.dirname(filePath), vendorPath)
      .split(path.sep)
      .join('/');

    const insertCode = `require('${vendorRelativePath}');`;

    if (assets[file]) {
      let source = assets[file].source().toString();
      if (source.startsWith(insertCode)) {
        continue;
      }
      source = `${insertCode}${source}`;

      logList.push({
        file,
        insertCode,
        subPackage: item.subPackage,
      });

      updateAssetSource(assets, file, source);
    }
  }

  saveJsonToLog(logList, 'add-common-vendor.result.json');
}


export function insetSpecialContent({
  fileList,
  assets,
  insertCode,
}: {
  fileList: Array<string>;
  insertCode: string;
  assets: Record<string, any>;
}) {
  const logList: Array<{
    file: string;
    insertCode: string;
  }> = [];
  fileList.forEach((file) => {
    if (assets[file]) {
      let source = assets[file].source().toString();
      if (source.includes(insertCode)) {
        return;
      }
      source = `${insertCode}${source}`;

      logList.push({
        file,
        insertCode,
      });

      updateAssetSource(assets, file, source);
    }
  });
  saveJsonToLog(logList, 'add-common-vendor.result-special.json');
}
