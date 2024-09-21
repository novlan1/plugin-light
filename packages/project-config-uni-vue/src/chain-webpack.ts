import { LOADER as crossModuleStyle } from 'webpack-loader-cross-module-style';
import { LOADER as crossGameStyle } from 'webpack-loader-cross-game-style';
import { LOADER as crossPlatform, LOADER_PROD as crossPlatformProd } from 'webpack-loader-cross-platform';

import { LOADER as insertGlobalComp } from 'webpack-loader-insert-global-comp';
import { LOADER as transformDynamicComp } from 'webpack-loader-transform-dynamic-comp';
import { LOADER as insertPageMeta } from 'webpack-loader-insert-page-meta';

import { LOADER as autoPlaceholder } from 'webpack-loader-auto-placeholder';
import { LOADER as replaceVueKey } from 'webpack-loader-replace-vue-key';
import { LOADER as replaceTemplateTag } from 'webpack-loader-replace-template-tag';

import { LOADER as vLazy } from 'webpack-loader-v-lazy';
import { LOADER as swipeComponent } from 'webpack-loader-swipe-component';
import { LOADER as removeScoped } from 'webpack-loader-remove-scoped';
import { LOADER as replaceLibrary } from 'webpack-loader-replace-library';


import type { GetUniVueConfig } from './types';


const LOADER_MAP = {
  insertGlobalComp,
  crossModuleStyle,
  crossGameStyle,
  crossPlatform,
  crossPlatformProd,

  transformDynamicComp,
  insertPageMeta,
  autoPlaceholder,
  replaceVueKey,
  replaceTemplateTag,
  vLazy,

  swipeComponent,
  removeScoped,
  replaceLibrary,
} as const;


export function chainWebpack(config: any, options: GetUniVueConfig = {}) {
  const { useXSS } = options;

  if (options.useInsertGlobalCompLoader) {
    config.module
      .rule('global-comp-vue')
      .test(/\.vue$/)
      .pre()
      .use(LOADER_MAP.insertGlobalComp)
      .loader(LOADER_MAP.insertGlobalComp)
      .options(options.insertGlobalCompLoaderOptions || {})
      .end();
  }

  if (options.useTransformDynamicCompLoader || options.useAddPlaceHolderPlugin) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.transformDynamicComp)
      .loader(LOADER_MAP.transformDynamicComp)
      .end();
  }

  if (options.useAddPlaceHolderPlugin) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.autoPlaceholder)
      .loader(LOADER_MAP.autoPlaceholder)
      .end();
  }

  if (options.useReplaceVueKeyLoader) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.replaceVueKey)
      .loader(LOADER_MAP.replaceVueKey)
      .end();
  }

  if (options.useReplaceTemplateTagLoader) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.replaceTemplateTag)
      .loader(LOADER_MAP.replaceTemplateTag)
      .options(options.replaceTemplateTagLoaderOptions || {})
      .end();
  }

  if (options.useVLazyLoader) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.vLazy)
      .loader(LOADER_MAP.vLazy)
      .options(options.vLazyLoaderOptions || {})
      .end();
  }

  if (options.useSwipeComponentLoader) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.swipeComponent)
      .loader(LOADER_MAP.swipeComponent)
      .end();
  }

  if (options.useRemoveScopedLoader) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.removeScoped)
      .loader(LOADER_MAP.removeScoped)
      .end();
  }

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use(LOADER_MAP.crossPlatform)
    .loader(LOADER_MAP.crossPlatform)
    .end()
    .use(LOADER_MAP.crossGameStyle) // 处理样式的loader，必须在vue-loader前执行
    .loader(LOADER_MAP.crossGameStyle)
    .end()
    .use(LOADER_MAP.crossModuleStyle)
    .loader(LOADER_MAP.crossModuleStyle)
    .options(options.crossModuleStyleLoaderOptions || {})
    .end()
    .use('vue-loader')
    .loader('vue-loader')
    .tap((options: any) => {
      if (options?.compilerOptions) {
        options.compilerOptions.whitespace = 'preserve';
      }
      return options;
    })
    .tap((options: any) => {
      if (useXSS && options?.compilerOptions) {
        options.compilerOptions.directives = {
          html(node: any, directiveMeta: any) {
            (node.props || (node.props = [])).push({
              name: 'innerHTML',
              value: `xss(_s(${directiveMeta.value}))`,
            });
          },
        };
      }
      return options;
    })
    .end();

  if (options.useInsertPageMetaLoader) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(LOADER_MAP.insertPageMeta)
      .loader(LOADER_MAP.insertPageMeta)
      .options(options.insertPageMetaLoaderOptions || {})
      .end();
  }

  config.module
    .rule('cross-platform-prod')
    .test(/\.[jt]s$/)
    .use(LOADER_MAP.crossPlatformProd)
    .loader(LOADER_MAP.crossPlatformProd)
    .end();

  if (options.useReplaceLibraryLoader) {
    config.module
      .rule('replace-library')

      .test(/\.(ts|js|vue)$/)
      .use(LOADER_MAP.replaceLibrary)
      .loader(LOADER_MAP.replaceLibrary)
      .options(options.replaceLibraryLoaderOptions || {})
      .end();
  }

  // 发行或运行时启用了压缩时会生效;
  config.optimization.minimizer('terser').tap((args: any) => {
    const { compress } = args[0].terserOptions;
    // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
    compress.drop_console = process.env.VUE_APP_BRANCH === 'release';
    compress.pure_funcs = [
      '__f__', // App 平台 vue 移除日志代码
      // 'console.debug' // 可移除指定的 console 方法
    ];
    return args;
  });
}
