import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TransformPages from 'uni-read-pages';

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
  // @ts-ignore
} from 'plugin-light/lib/plugin';


import { updateManifest } from './replace-manifest';
import type { GetUniVueConfig } from './types';


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
      fileSuffix: ['css', 'scss', 'less', 'wxss', 'qss', 'js'],
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
    console.log(process.env.NODE_ENV, process.env.VUE_APP_ROUTER_BASE);
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

  console.log('process.argv', process.argv);
  if (process.argv.includes('--bundleAnalyzer')) {
    plugins.push(new BundleAnalyzerPlugin({
      port: 8000,
    }));
  }

  return plugins;
}
