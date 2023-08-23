import * as fs from 'fs';
import * as path from 'path';
import globToRegExp from 'glob-to-regexp';
import { parseComponent } from 'vue-template-compiler';
import { execCommand, mkDirsSync, traverseFolder } from 't-comm';


import { findDependencies } from '../../../helper/find-dependencies';


export function isInIgnoreGlob(file, ignoreGlob, projectRoot) {
  for (const item of ignoreGlob) {
    const re = globToRegExp(item);
    const relativeFile = path.relative(projectRoot, file);

    if (re.test(relativeFile)) {
      return true;
    }
  }
  return false;
}


export function resolveFilePath(file, {
  projectRoot,
  fromFile,
  fileExts,
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


export function parseRoot(root) {
  const list: Array<string> = [];
  if (fs.existsSync(root)) {
    if (fs.statSync(root).isDirectory()) {
      traverseFolder((path) => {
        list.push(path);
      }, root);
    } else {
      return [root];
    }
  }
  return list;
}

// 传入绝对路径
export function findFile(filePath, fileExts) {
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


export function readFile(file) {
  const content = fs.readFileSync(file, {
    encoding: 'utf-8',
  });
  return content;
}


export function writeFile(file, data) {
  fs.writeFileSync(file, data, {
    encoding: 'utf-8',
  });
}


export function isVue(file) {
  return file.endsWith('.vue');
}


export function findDependenciesFromFile(file) {
  const content = readFile(file);
  if (isVue(file)) {
    const res = parseComponent(content);
    const styleDependencies = res.styles
      .map(item => item.src)
      .filter(item => item);

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


export function copyFile(from, to) {
  if (!fs.existsSync(to)) {
    mkDirsSync(path.dirname(to));
    execCommand(`cp -r ${from} ${to}`);
  } else {
    const content = readFile(from);
    writeFile(to, content);
  }
}

export function removeJSFile(file) {
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
