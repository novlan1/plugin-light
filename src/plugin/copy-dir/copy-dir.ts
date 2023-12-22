// eslint-disable-next-line @typescript-eslint/no-require-imports
const childProcess = require('child_process');

export class CopyDirPlugin {
  // {dirs:[{from,to}]}
  constructor(options) {
    // @ts-ignore
    this.options = options;
  }

  apply(compiler) {
    // 编译后处理
    compiler.hooks.done.tap('CopyDirPlugin', () => {
      this.move();
    });
  }
  move() {
    // @ts-ignore
    const { dirs = [] } = this.options;
    dirs.forEach((dir) => {
      if (dir.from && dir.to) {
        const result = dir.type === 'mv' ? childProcess.spawnSync('mv', ['-f', dir.from, dir.to]) : childProcess.spawnSync('cp', ['-rf', dir.from, dir.to]);
        if (result.error) {
          console.log(result.error);
        }
      }
    });
  }
}

