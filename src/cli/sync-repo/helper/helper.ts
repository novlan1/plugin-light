import * as fs from 'fs';
import * as path from 'path';
import globToRegExp from 'glob-to-regexp';
import { parseComponent } from 'vue-template-compiler';
import { execCommand, mkDirsSync, traverseFolder } from 't-comm';


import { findDependencies } from '../../../helper/find-dependencies';


export function isInIgnoreGlob(file: string, ignoreGlob: Array<string>, projectRoot: string) {
  for (const item of ignoreGlob) {
    const re = globToRegExp(item);
    const relativeFile = path.relative(projectRoot, file);

    if (re.test(relativeFile)) {
      return true;
    }
  }
  return false;
}


export function resolveFilePath(file: string, {
  projectRoot,
  fromFile,
  fileExts,
}: {
  projectRoot: string;
  fromFile: string;
  fileExts: Array<string>;
}) {
  if (file.startsWith('src')) {
    return findFile(path.resolve(projectRoot, file), fileExts)?.file;
  }

  if (!file.startsWith('.')) {
    // node_modules
    return;
  }
  const dir = path.dirname(fromFile);
  return findFile(path.resolve(dir, file), fileExts)?.file;
}


export function parseRoot(root: string) {
  const list: Array<string> = [];
  if (fs.existsSync(root)) {
    if (fs.statSync(root).isDirectory()) {
      traverseFolder((path: string) => {
        list.push(path);
      }, root);
    } else {
      return [root];
    }
  }
  return list;
}

// 传入绝对路径
export function findFile(filePath: string, fileExts: Array<string>) {
  if (fs.existsSync(filePath)) {
    if (!fs.statSync(filePath).isDirectory()) {
      return {
        file: filePath,
      };
    }
    filePath = path.resolve(filePath, 'index');
  }

  for (const postfix of fileExts) {
    const newFilePath = `${filePath}.${postfix}`;
    if (fs.existsSync(newFilePath)) {
      return {
        file: newFilePath,
      };
    }
  }

  return null;
}


export function readFile(file: string) {
  const content = fs.readFileSync(file, {
    encoding: 'utf-8',
  });
  return content;
}


export function writeFile(file: string, data: string) {
  fs.writeFileSync(file, data, {
    encoding: 'utf-8',
  });
}


export function isVue(file: string) {
  return file.endsWith('.vue');
}


export function findDependenciesFromFile(file: string): Array<string> {
  const content = readFile(file);
  if (isVue(file)) {
    const res = parseComponent(content);
    const styleDependencies = res.styles
      .map(item => item.src)
      .filter(item => item) as string[];

    return [
      ...findDependencies(res?.script?.content || ''),
      ...styleDependencies,
    ];
  }

  if (/\.(scss|css|less)$/.test(file)) {
    return [];
  }

  return findDependencies(content);
}


export function copyFile(from: string, to: string) {
  if (!fs.existsSync(to)) {
    mkDirsSync(path.dirname(to));
    execCommand(`cp -r ${from} ${to}`);
  } else {
    const content = readFile(from);
    writeFile(to, content);
  }
}

export function removeJSFile(file: string) {
  if (!fs.existsSync(file)) return;
  const extension = path.extname(file);

  if (extension === '.ts') {
    const jsFile = file.replace(/\.ts$/, '.js');

    if (fs.existsSync(jsFile)) {
      fs.unlinkSync(jsFile);
      console.log('[light cli] 删除JS文件', jsFile);
    }
  }
}
