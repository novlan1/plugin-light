import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TransformPages from 'uni-read-pages';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';

import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import { BUILD_NAME_MAP } from 't-comm/lib/v-console/config';
import WorkboxPlugin from 'workbox-webpack-plugin';

import {
  getProjectName,
  getSubProjectName,
  checkBundleAnalyze,
  CSS_POSTFIX_MAP,
  checkH5,
} from 'plugin-light-shared';
import { getExternalScripts } from './external';

// import {
//   // GenVersionMpPlugin,
//   // GenVersionWebPlugin,
//   // RemToRpxPlugin,
//   // TransferLocalFilePlugin,
//   // FixNpmPackagePlugin,
//   // GlobalThisPolyfillPlugin,

//   // DispatchScriptPlugin,
//   // DispatchVuePlugin,
//   // CopyDirPlugin,
//   // AddPlaceHolderPlugin,
//   // FixMiniCssPlugin,
//   // InsertScriptPlugin,
//   // ManifestExposePlugin,
//   // CustomPreloadPlugin,
//   // CheckLongConstantPlugin,
//   // ReplaceUniH5Plugin,
//   // FixImportPathPlugin,
//   GenMpPluginPlaygroundPlugin,
//   // @ts-ignore
// } from 'plugin-light/lib/plugin';

import { RemToRpxPlugin } from 'webpack-plugin-rem-to-rpx';
import { CopyDirPlugin } from 'webpack-plugin-copy-dir';
import { GenVersionMpPlugin, GenVersionWebPlugin } from 'webpack-plugin-gen-version';

import { ReplaceUniH5Plugin } from 'webpack-plugin-replace-uni-h5';
import { DispatchScriptPlugin } from 'webpack-plugin-dispatch-script';
import { DispatchVuePlugin } from 'webpack-plugin-dispatch-vue';

import { TransferLocalFilePlugin } from 'webpack-plugin-transfer-local-file';
import { GlobalThisPolyfillPlugin } from 'webpack-plugin-global-this-polyfill';
import { FixNpmPackagePlugin } from 'webpack-plugin-fix-npm-package';

import { AddPlaceHolderPlugin } from 'webpack-plugin-add-placeholder';
import { FixMiniCssPlugin } from 'webpack-plugin-fix-mini-css-plugin';
import { InsertScriptPlugin } from 'webpack-plugin-insert-script';

import { ManifestExposePlugin } from 'webpack-plugin-manifest-expose';
import { CustomPreloadPlugin } from 'webpack-plugin-custom-preload';
import { CheckLongConstantPlugin } from 'webpack-plugin-check-long-constant';

import { FixImportPathPlugin } from 'webpack-plugin-fix-import-path';
import { GenMpPluginPlaygroundPlugin } from 'webpack-plugin-gen-mp-plugin-playground';


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
  genVersionWebPluginOptions = {
    buildName: BUILD_NAME_MAP.build,
    commitName: BUILD_NAME_MAP.commit,
    delay: 1,
  },

  useFixMiniCssPlugin = false,

  aegisWebSdkExternal,
  uniSimpleRouterExternal,
  axiosExternal,
  vueLazyloadExternal,

  customPreload,

  useWorkBoxPlugin,
  saveBundleAnalyzeHtml,
  useReplaceUniH5Plugin,
}: GetUniVueConfig) {
  const plugins: Array<any> = [];
  const isProduction = process.env.NODE_ENV === 'production';

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
    const mpPluginName = process.env.VUE_APP_MP_PLUGIN;
    plugins.push(new FixNpmPackagePlugin({
      pluginName: mpPluginName,
    }));

    if (process.env.VUE_APP_PLATFORM === 'mp-qq') {
      plugins.push(new GlobalThisPolyfillPlugin());
    }
    if (useDispatchVuePlugin) {
      plugins.push(new DispatchVuePlugin(dispatchVuePluginOptions || {}));
    }
    if (useDispatchScriptPlugin) {
      plugins.push(new DispatchScriptPlugin(dispatchScriptPluginOptions || {}));
    }
    if (useAddPlaceHolderPlugin) {
      plugins.push(new AddPlaceHolderPlugin());
    }

    if (mpPluginName) {
      plugins.push(new FixImportPathPlugin({
        pluginName: mpPluginName,
      }));
      plugins.push(new GenMpPluginPlaygroundPlugin({
        pluginName: mpPluginName,
      }));
    }
  } else {
    if (isProduction && process.env.VUE_APP_ROUTER_BASE && process.env.VUE_APP_ROUTER_BASE !== '/') {
      updateManifest('h5.router.base', JSON.stringify(process.env.VUE_APP_ROUTER_BASE));
    }
    if (process.env.VUE_APP_BRANCH !== 'release' && process.env.UNI_OPT_TREESHAKINGNG) {
      delete process.env.UNI_OPT_TREESHAKINGNG;
    }
    process.env.UNI_OUTPUT_DIR = `${(process.env.UNI_INPUT_DIR || '').replace(
      'src/project',
      'dist/project',
    )}/static`;
    plugins.push(new GenVersionWebPlugin(genVersionWebPluginOptions));

    if (isProduction) {
      plugins.push(new CheckLongConstantPlugin());
    }
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
  } else if (saveBundleAnalyzeHtml && isProduction) {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'my-bundle-analyze.html',
      ...(typeof saveBundleAnalyzeHtml === 'object' ? saveBundleAnalyzeHtml : {}),
    }));
  }

  if (useFixMiniCssPlugin) {
    plugins.push(new FixMiniCssPlugin());
  }

  plugins.push(new ProgressBarPlugin({
    format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
    clear: false,
  }));

  const externalScripts: Array<string> = getExternalScripts({
    aegisWebSdkExternal,
    uniSimpleRouterExternal,
    axiosExternal,
    vueLazyloadExternal,
  });

  if (externalScripts.length && checkH5()) {
    plugins.push(new InsertScriptPlugin({
      scripts: externalScripts,
    }));
  }

  if (customPreload && checkH5()) {
    plugins.push(...[
      new CustomPreloadPlugin(typeof customPreload === 'boolean' ? {} : customPreload),
      new ManifestExposePlugin(),
      new ScriptExtHtmlWebpackPlugin({
        inline: /runtime/,
      }),
    ]);
  }

  if (useReplaceUniH5Plugin && checkH5()) {
    plugins.push(new ReplaceUniH5Plugin(useReplaceUniH5Plugin));
  }

  if (checkH5() && useWorkBoxPlugin && isProduction) {
    plugins.push(new WorkboxPlugin.GenerateSW({
      swDest: `./service-worker-${getProjectName()}-${getSubProjectName()}.js`,
      clientsClaim: true,
      include: [/.*(.js|.css|.svg|.png|.jpg|.jpeg)/],
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
      importScripts: [],
      inlineWorkboxRuntime: true,
      runtimeCaching: [{
        urlPattern: new RegExp('^https://image-1251917893\\.file\\.myqcloud.com.*(\\.js|\\.css|\\.svg|\\.png|\\.jpg|\\.jpeg)'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }, {
        urlPattern: /.*\.html$/,
        handler: 'NetworkOnly',
      }],

      ...useWorkBoxPlugin,
    }));
  }

  return plugins;
}
