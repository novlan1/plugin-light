/* eslint-disable @typescript-eslint/no-require-imports */

export function parseSetDeps(deps) {
  return Object.keys(deps).reduce((acc, item) => {
    acc[item]  = Array.from(deps[item]);

    acc[item].sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
    return acc;
  }, {});
}


export function getRelativePath(filePath) {
  const path = require('path');
  return path.relative(process.cwd(), path.resolve(filePath));
}
