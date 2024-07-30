import * as fs from 'fs';
import * as path from 'path';
import { getGitCurBranch } from 't-comm';

import { getRootDir } from '../helper/root';
import { LOADER_MAP } from '../../webpack-loader/index';
import { getPlugins } from './plugin';
import { chainWebpack } from './chain-webpack';

import { DEFAULT_TRANSPILE_DEPENDENCIES, DEFAULT_ADAPTER_DIRS } from './config';
import type { GetUniVueConfig } from './types';
import { optimizationH5 } from './optimization-h5';
import { getExternals } from './external';

import { checkH5 } from '../helper/h5';
import { checkDebugMode } from '../helper/bundle-analyze';

const curDirname = getRootDir();


function getDefaultNeedSourceMap() {
  const needSourceMap = checkH5() && process.env.NODE_ENV === 'production' && getGitCurBranch(__dirname) === 'release';

  return needSourceMap;
}


// 获取目下所有项目文件夹名称并创建webpack别名
function getAllAppNameAlias(usePMDBusinessAlias = false) {
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
  if (usePMDBusinessAlias) {
    return {
      ...alias,
      'src/component': 'pmd-business',
    };
  }
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
    useFixMiniCssPlugin,

    aegisWebSdkExternal = true,
    uniSimpleRouterExternal = false,
    axiosExternal = false,

    customPreload = false,
    usePMDBusinessAlias = false,
  } = options || {};

  let transpileDependencies = DEFAULT_TRANSPILE_DEPENDENCIES;
  let adapterDirs = DEFAULT_ADAPTER_DIRS;
  let needSourceMap = getDefaultNeedSourceMap();

  if (options?.adapterDirs) {
    adapterDirs = options.adapterDirs || [];
  }
  if (options?.transpileDependencies) {
    transpileDependencies = options.transpileDependencies;
  }

  if (typeof options?.needSourceMap === 'boolean') {
    needSourceMap = options.needSourceMap;
  }

  const useH5SplitChunks = checkH5() && process.env.NODE_ENV === 'production'
    ? options?.useH5SplitChunks
    : false;
  const optimization: Record<string, any> = {};
  if (useH5SplitChunks) {
    optimization.runtimeChunk = { name: 'runtime' };
  }
  if (checkDebugMode()) {
    optimization.minimize = false;
  }

  return {
    parallel: process.env.NODE_ENV !== 'production',
    lintOnSave: options.lintOnSave || false, // 忽略编译时候的eslint报错
    configureWebpack: {
      resolve: {
        alias: {
        // 添加游戏人生alias
          ...getAllAppNameAlias(usePMDBusinessAlias),
        },
      },
      externals: getExternals({
        aegisWebSdkExternal,
        uniSimpleRouterExternal,
        axiosExternal,
        vueLazyloadExternal: options.vueLazyloadExternal,
      }),
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
        useFixMiniCssPlugin,

        aegisWebSdkExternal,
        uniSimpleRouterExternal,
        axiosExternal,
        vueLazyloadExternal: options.vueLazyloadExternal,

        customPreload,

        useWorkBoxPlugin: options.useWorkBoxPlugin,
        saveBundleAnalyzeHtml: options.saveBundleAnalyzeHtml,
        useReplaceUniH5Plugin: options.useReplaceUniH5Plugin,
      }),
      module: {
        rules: [
          {
            test: /\.(css)$/,
            use: [LOADER_MAP.cssUrlBlankSpace],
          },
        ],
      },
      optimization,

      ...(needSourceMap ? {
        devtool: 'hidden-source-map',
      } : {}),
      // watchOptions: {
      //   ignored: [/node_modules/],
      // },
    },

    ...(useH5SplitChunks ? { pages: optimizationH5(useH5SplitChunks).pages } : {}),

    transpileDependencies,

    chainWebpack(config: any) {
      chainWebpack(config, options);

      if (useH5SplitChunks) {
        optimizationH5(useH5SplitChunks).chainWebpack(config);
      }
    },
  };
}
