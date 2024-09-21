import * as childProcess from 'child_process';
import type { ICopyDirOptions } from './types';


export class CopyDirPlugin {
  options: ICopyDirOptions;

  constructor(options: ICopyDirOptions) {
    this.options = options;
  }

  apply(compiler: any) {
    // 编译后处理
    compiler.hooks.done.tap('CopyDirPlugin', () => {
      this.move();
    });
  }
  move() {
    // @ts-ignore
    const { dirs = [] } = this.options || {};
    dirs.forEach((dir) => {
      if (dir.from && dir.to) {
        const result = dir.type === 'mv' ? childProcess.spawnSync('mv', ['-f', dir.from, dir.to]) : childProcess.spawnSync('cp', ['-rf', dir.from, dir.to]);
        if (result.error) {
          console.warn(result.error);
        }
      }
    });
  }
}

