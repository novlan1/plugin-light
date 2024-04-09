
import * as path from 'path';
import { flat } from 't-comm/lib/base/list/flat';

import {
  isInIgnoreGlob,
  resolveFilePath,
  findFile,
  copyFile,
  findDependenciesFromFile,
  parseRoot,
  removeJSFile,
} from './helper/helper';
import { getConfig, getRoot } from './helper/get-config';
import { DEFAULT_EXTENSIONS } from './helper/config';
import { saveJsonToLog } from '../../helper/index';
import type { IFiles } from './helper/types';

const visitedFiles: Array<string> = [];
const fileDependencyMap: Record<string, Array<string>> = {};


function parseParams(files: IFiles, {
  ignore,
  projectRoot,
}: {
  ignore: Array<string>;
  projectRoot: string
}): any {
  return flat(files.map((file) => {
    let from;
    let level = Infinity;

    if (typeof file === 'string') {
      from = file;
    } else {
      from = file.from;
      level = file.level || level;
    }

    let parsedFiles;
    if (Array.isArray(from)) {
      parsedFiles = flat(from.map(item => parseRoot(item)));
    } else {
      parsedFiles = parseRoot(from);
    }

    return parsedFiles
      .filter(item => !isInIgnoreGlob(item, ignore, projectRoot))
      .map(item => ({
        from: item,
        level,
      }));
  }));
}


export function syncRepo() {
  const { files = [], target, ignore = [], extensions = DEFAULT_EXTENSIONS, shouldReplaceJS = true } = getConfig();
  if (!files.length) {
    console.error('files 长度不能为0');
    return;
  }
  if (!target) {
    console.log('target 不能为空');
    return;
  }

  const projectRoot = getRoot();
  // visitedFiles.push(...files);
  const parsedFiles = parseParams(files, {
    ignore,
    projectRoot,
  });
  const allDependencies: Set<string> = new Set(parsedFiles.map((item: { from: string }) => item.from));

  findAllDependencies({
    files: parsedFiles,
    projectRoot,
    dependencies: allDependencies,
    extensions,
    ignore,
  });

  const allDependencyList: Array<string> = Array.from(allDependencies);

  for (const file of allDependencyList) {
    const relativeFile = path.relative(projectRoot, file);
    const to = path.resolve(projectRoot, target, relativeFile);

    copyFile(file, to);
    if (shouldReplaceJS) {
      removeJSFile(to);
    }
  }

  saveJsonToLog(fileDependencyMap, 'sync-repo.json');
}

function findAllDependencies({
  files,
  projectRoot,
  dependencies,
  extensions,
  ignore,
}: {
  files: Array<{ from: string, level?: number }>;
  projectRoot: string;
  dependencies: Set<string>;
  extensions: Array<string>;
  ignore: Array<string>;
}) {
  for (const file of files) {
    const { from, level } = file;
    if (!level) continue;

    const foundFile = findFile(from, extensions);

    if (foundFile
      && !visitedFiles.includes(foundFile.file)
      && !isInIgnoreGlob(foundFile.file, ignore, projectRoot)
    ) {
      const sourceList = findDependenciesFromFile(foundFile.file)
        .map(file => resolveFilePath(file, {
          projectRoot,
          fromFile: foundFile.file,
          fileExts: extensions,
        }))
        .filter(item => item)
        .filter(item => !isInIgnoreGlob(item!, ignore, projectRoot)) as string[];

      visitedFiles.push(foundFile.file);
      sourceList.forEach(item => dependencies.add(item!));
      fileDependencyMap[foundFile.file] = sourceList;

      findAllDependencies({
        files: sourceList.map(file => ({
          from: file,
          level: level - 1,
        })),
        projectRoot,
        dependencies,
        extensions,
        ignore,
      });
    }
  }
}

