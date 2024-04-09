import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TransformPages from 'uni-read-pages';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';

import {
  GenVersionMpPlugin,
  GenVersionWebPlugin,
  RemToRpxPlugin,
  TransferLocalFilePlugin,
  FixNpmPackagePlugin,
  GlobalThisPolyfillPlugin,

  DispatchScriptPlugin,
  DispatchVuePlugin,
  CopyDirPlugin,
  AddPlaceHolderPlugin,
  FixMiniCssPlugin,
  InsertScriptPlugin,
  ManifestExposePlugin,
  CustomPreloadPlugin,
  // @ts-ignore
} from 'plugin-light/lib/plugin';


import { updateManifest } from './replace-manifest';
import { checkBundleAnalyze } from '../helper/bundle-analyze';
import type { GetUniVueConfig } from './types';
import { CSS_POSTFIX_MAP } from '../../helper/config';
import { AEGIS_EXTERNAL_SCRIPT_LINK, UNI_SIMPLE_ROUTER_SCRIPT_LINK } from './config';
import { checkH5 } from '../helper/h5';


export function getPlugins({
  adapterDirs,
  useDispatchScriptPlugin = false,
  dispatchScriptPluginOptions = {},

  useDispatchVuePlugin = false,
  dispatchVuePluginOptions = {},

  useCopyDirPlugin = false,
  copyDirPluginOptions = {},

  useAddPlaceHolderPlugin = false,

  remToRpxPluginMpOptions = {},
  genVersionWebPluginOptions = {},

  useFixMiniCssPlugin = false,

  aegisWebSdkExternal,
  uniSimpleRouterExternal,
  customPreload,
}: GetUniVueConfig) {
  const plugins: Array<any> = [];

  if (process.env.VUE_APP_PLATFORM === 'app-plus') {
    const globalVarsDefinePlugin = new webpack.DefinePlugin({
      location: 'window.location',
      navigator: 'window.navigator',
      localStorage: 'window.localStorage',
      sessionStorage: 'window.sessionStorage',
      globalVars: 'window.globalVars',
      document: 'window.document',
      app: 'window.app',
    });

    plugins.push(globalVarsDefinePlugin);
    plugins.push(new RemToRpxPlugin({
      unit: 'px',
      factor: 50,
      fileSuffix: [
        'css',
        'scss',
        'less',
        'js',

        CSS_POSTFIX_MAP.MP_WX,
        CSS_POSTFIX_MAP.MP_QQ,
        CSS_POSTFIX_MAP.MP_ALIPAY,
        CSS_POSTFIX_MAP.MP_JD,
      ],
    }));
  } else if (process.env.VUE_APP_PLATFORM !== 'h5') {
    const globalVarsDefinePlugin = new webpack.DefinePlugin({
      window: 'globalThis.$window',
      location: 'globalThis.$location',
      navigator: 'globalThis.$navigator',
      localStorage: 'globalThis.$localStorage',
      sessionStorage: 'globalThis.$sessionStorage',
      globalVars: 'globalThis.$globalVars',
      document: 'globalThis.$document',
      app: 'globalThis.$window.app',
      top: 'globalThis.$window',
      defaultIsTestNet: process.env.NET_ENV === 'test',
    });

    plugins.push(globalVarsDefinePlugin);
    plugins.push(new RemToRpxPlugin(remToRpxPluginMpOptions || {}));
    plugins.push(new GenVersionMpPlugin({}));
    plugins.push(new TransferLocalFilePlugin({
      adapterDirs,
      isModifyRef: true,
    }));
    plugins.push(new FixNpmPackagePlugin({}));

    if (process.env.VUE_APP_PLATFORM === 'mp-qq') {
      plugins.push(new GlobalThisPolyfillPlugin());
    }

    if (useDispatchScriptPlugin) {
      plugins.push(new DispatchScriptPlugin(dispatchScriptPluginOptions || {}));
    }
    if (useDispatchVuePlugin) {
      plugins.push(new DispatchVuePlugin(dispatchVuePluginOptions || {}));
    }
    if (useAddPlaceHolderPlugin) {
      plugins.push(new AddPlaceHolderPlugin());
    }
  } else {
    if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_ROUTER_BASE && process.env.VUE_APP_ROUTER_BASE !== '/') {
      updateManifest('h5.router.base', JSON.stringify(process.env.VUE_APP_ROUTER_BASE));
    }
    if (process.env.VUE_APP_BRANCH !== 'release' && process.env.UNI_OPT_TREESHAKINGNG) {
      delete process.env.UNI_OPT_TREESHAKINGNG;
    }
    process.env.UNI_OUTPUT_DIR = `${(process.env.UNI_INPUT_DIR || '').replace(
      'src/project',
      'dist/project',
    )}/static`;
    plugins.push(new GenVersionWebPlugin(genVersionWebPluginOptions || {}));
  }

  if (useCopyDirPlugin) {
    plugins.push(new CopyDirPlugin(copyDirPluginOptions || {}));
  }

  plugins.push(new webpack.DefinePlugin({
    ROUTES: webpack.DefinePlugin.runtimeValue(() => {
      const tfPages = new TransformPages({
        includes: ['path', 'name', 'aliasPath', 'meta'],
      });
      return JSON.stringify(tfPages.routes);
    }, true),
    VERSION: new Date().getTime(),
  }));

  if (checkBundleAnalyze()) {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerPort: 8888,
    }));
  }

  if (useFixMiniCssPlugin) {
    plugins.push(new FixMiniCssPlugin());
  }

  plugins.push(new ProgressBarPlugin({
    format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
    clear: false,
  }));

  const externalScripts: Array<string> = [];
  if (typeof aegisWebSdkExternal === 'string') {
    externalScripts.push(aegisWebSdkExternal);
  } else if (aegisWebSdkExternal) {
    externalScripts.push(AEGIS_EXTERNAL_SCRIPT_LINK);
  }

  if (typeof uniSimpleRouterExternal === 'string') {
    externalScripts.push(uniSimpleRouterExternal);
  } else if (uniSimpleRouterExternal) {
    externalScripts.push(UNI_SIMPLE_ROUTER_SCRIPT_LINK);
  }

  if (externalScripts.length && checkH5()) {
    plugins.push(new InsertScriptPlugin({
      scripts: externalScripts,
    }));
  }

  if (customPreload && checkH5()) {
    plugins.push(...[
      new CustomPreloadPlugin(customPreload),
      new ManifestExposePlugin(),
      new ScriptExtHtmlWebpackPlugin({
        inline: /runtime/,
      }),
    ]);
  }

  return plugins;
}
