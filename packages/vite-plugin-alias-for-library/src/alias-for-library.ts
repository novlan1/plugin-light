import { execCommand } from 't-comm';
import type { IAliasForLibraryOptions } from './types';


function tExecCommand(command: string, root: string) {
  execCommand(command, root, 'inherit');
}

export function aliasForLibrary(options?: IAliasForLibraryOptions) {
  const { list = [], target = '', root = '' } = options || {};

  return {
    name: 'vite-plugin-alias-for-library',
    buildStart() {
      if (!list.length || !target) return;
      const innerRoot = root || process.cwd();


      tExecCommand(`mkdir -p ${target} || true`, innerRoot);

      list.forEach((item) => {
        const folderList = item.split('/');
        const folder = folderList[folderList.length - 1];

        // cp -L 复制软链接对应的真实内容
        const command = `rm -rf ${target}/${folder} && cp -rL node_modules/${item} ${target} || cp -r node_modules/${item} ${target} || true`;

        tExecCommand(command, innerRoot);
        console.log(`[Done] Copied ${item} success!`);
      });
    },
  };
}

