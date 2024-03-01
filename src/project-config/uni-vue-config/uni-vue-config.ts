import * as fs from 'fs';
import * as path from 'path';

import { getRootDir } from '../helper/root';
import { LOADER_MAP } from '../../webpack-loader/index';
import { getPlugins } from './plugin';
import { chainWebpack } from './chain-webpack';
import { DEFAULT_TRANSPILE_DEPENDENCIES, DEFAULT_ADAPTER_DIRS } from './config';
import type { GetUniVueConfig } from './types';

const curDirname = getRootDir();


// 获取目下所有项目文件夹名称并创建webpack别名
function getAllAppNameAlias() {
  const files = fs.readdirSync(path.resolve(curDirname, 'src'));
  const result: Record<string, Array<any>> = {
    foldername: [], // 文件夹名字
    filename: [], // 文件名，有后缀
  };
  files.forEach((file) => {
    const pathname = path.join(curDirname, 'src', file);
    const stat = fs.lstatSync(pathname);
    if (!stat.isDirectory()) {
      result.filename.push(file);
    } else {
      result.foldername.push(file);
    }
  });

  const rootDir = 'src';
  const alias: Record<string, string> = {
    src: path.resolve(curDirname, rootDir),
    '@': path.resolve(process.env.UNI_INPUT_DIR || ''), // 由环境变量确定当前的项目
  };
  result.foldername.forEach((dir) => {
    alias[dir] = path.resolve(curDirname, rootDir, dir);
  });
  return alias;
}


export function getUniVueConfig(options: GetUniVueConfig = {}) {
  const {
    useDispatchScriptPlugin,
    dispatchScriptPluginOptions,

    useDispatchVuePlugin,
    dispatchVuePluginOptions,

    useCopyDirPlugin,
    copyDirPluginOptions,

    useAddPlaceHolderPlugin,

    remToRpxPluginMpOptions,
    genVersionWebPluginOptions,
  } = options || {};

  let transpileDependencies = DEFAULT_TRANSPILE_DEPENDENCIES;
  let adapterDirs = DEFAULT_ADAPTER_DIRS;

  if (options?.adapterDirs) {
    adapterDirs = options.adapterDirs || [];
  }
  if (options?.transpileDependencies) {
    transpileDependencies = options.transpileDependencies;
  }

  return {
    parallel: process.env.NODE_ENV !== 'production',
    lintOnSave: options.lintOnSave || false, // 忽略编译时候的eslint报错
    configureWebpack: {
      resolve: {
        alias: {
        // 添加游戏人生alias
          ...getAllAppNameAlias(),
        },
      },
      plugins: getPlugins({
        adapterDirs,
        useDispatchScriptPlugin,
        dispatchScriptPluginOptions,

        useDispatchVuePlugin,
        dispatchVuePluginOptions,

        useCopyDirPlugin,
        copyDirPluginOptions,

        useAddPlaceHolderPlugin,

        remToRpxPluginMpOptions,
        genVersionWebPluginOptions,
      }),
      module: {
        rules: [
          {
            test: /\.(css)$/,
            use: [LOADER_MAP.cssUrlBlankSpace],
          },
        ],
      },
      // watchOptions: {
      //   ignored: [/node_modules/],
      // },
    },

    transpileDependencies,

    chainWebpack(config: any) {
      chainWebpack(config, options);
    },
  };
}
