import path from 'path';
import { loadEnv } from 'vite';

import { visualizer } from 'rollup-plugin-visualizer';
import basicSsl from '@vitejs/plugin-basic-ssl';
import commonjs from 'vite-plugin-commonjs';
import vueJsx from '@vitejs/plugin-vue-jsx';


import tailwindcss from 'tailwindcss';
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';

import { addCodeAtEndVitePlugin } from '@plugin-light/vite-plugin-add-code-at-end';
import { crossPlatformVitePlugin } from '@plugin-light/vite-plugin-cross-platform';
import { crossGameStyleVitePlugin } from '@plugin-light/vite-plugin-cross-game-style';
import { fixUniDirVitePlugin } from '@plugin-light/vite-plugin-fix-uni-dir';

import { genMpQQAppIdVitePlugin } from '@plugin-light/vite-plugin-gen-mp-qq-app-id';
import { globalThisPolyfillVitePlugin } from '@plugin-light/vite-plugin-global-this-polyfill';
import { genVersionMpVitePlugin, genVersionWebVitePlugin } from '@plugin-light/vite-plugin-gen-version';

import { removeUseRemVitePlugin } from '@plugin-light/vite-plugin-remove-use-rem';
import { remToRpxVitePlugin  } from '@plugin-light/vite-plugin-rem-to-rpx';
import { removeVueDirectiveVitePlugin } from '@plugin-light/vite-plugin-remove-vue-directive';
import { transformVLazyVitePlugin } from '@plugin-light/vite-plugin-transform-v-lazy';

import transformWebTag from '@plugin-light/postcss-plugin-transform-web-tag/lib/index';


import { BUILD_NAME_MAP } from 't-comm/lib/v-console/config';
import { TransformPages } from '@plugin-light/uni-read-pages-vite';
import {
  updateManifest,
  getSubProjectConfig,
  getSubProjectRoot,
  isH5 as rawIsH5,
  isMpQQ as rawIsMpQQ,
} from '@plugin-light/shared';


import type { IUniViteConfigOptions } from './types';


const ENV_PREFIX = ['VITE_', 'VUE_APP'];
const root: string = process.cwd();
const PORT = 443;
const DEFAULT_WARN_LIST = [
  'v-model=',
  'destroyed()',
  'beforeDestroy()',
  '$router.push',
  '$router.replace',
];


process.env.VITE_ROOT_DIR = process.env.UNI_INPUT_DIR;

const CUSTOM_ELEMENTS = [
  'Button',
  'Input',
  'Textarea',
];


export function getUniVue3ViteConfig({
  mode,
  uni,

  port = PORT,
  https,
  host = true,
  prePlugins = [],
  postPlugins = [],
  optimizeDepsIncludes = [],
  removeVueDirectionOptions,
  hmr = {
    timeout: 1000 * 60 * 5,
  },
  warnList,

  transformWebTagOptions,
  tailwindcssOptions,
  uniTailwindOptions,
}: IUniViteConfigOptions) {
  const env = loadEnv(mode, root, ENV_PREFIX);
  const isProduction = mode === 'production';
  const appDir = env.VUE_APP_DIR || '';

  const vueAppBase = env.VUE_APP_PUBLICPATH;
  const isH5 = rawIsH5() ;
  const isMpQQ = rawIsMpQQ();
  const subProjectRoot = getSubProjectRoot({
    root,
    appDir,
  });

  const subProjectConfig =  getSubProjectConfig(subProjectRoot);
  const iRemoveVueDirectionOptions = removeVueDirectionOptions ?? isH5 ? null : {
    list: ['treport'],
  };
  if (isH5 && isProduction && env.VUE_APP_ROUTER_BASE && env.VUE_APP_ROUTER_BASE !== '/') {
    updateManifest('h5.router.base', JSON.stringify(env.VUE_APP_ROUTER_BASE));
  }

  const defines = isH5 ? {
    VERSION: new Date().getTime(),
  } : {
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
    ROUTES: new TransformPages().routes,
    VERSION: new Date().getTime(),
  };

  const genVersionPlugin = isH5 ? genVersionWebVitePlugin({
    buildName: BUILD_NAME_MAP.build,
    commitName: BUILD_NAME_MAP.commit,
    delay: 10,
  }) : genVersionMpVitePlugin();

  const postcssPlugins = [];
  let cssConfig = {};

  if (!isH5 && transformWebTagOptions) {
    postcssPlugins.push(transformWebTag(typeof transformWebTagOptions === 'boolean' ? undefined : transformWebTagOptions));
  }
  if (tailwindcssOptions) {
    postcssPlugins.push(tailwindcss(typeof tailwindcssOptions === 'boolean' ? undefined : tailwindcssOptions));
  }

  if (postcssPlugins.length) {
    cssConfig = {
      css: {
        postcss: {
          plugins: postcssPlugins,
        },
      },
    };
  }


  return {
    root: subProjectRoot,
    envDir: process.cwd(),
    base: vueAppBase || './',
    ...cssConfig,
    plugins: [
      ...prePlugins,
      isH5 ? null : remToRpxVitePlugin(),
      isH5 ? null : transformVLazyVitePlugin(),
      crossPlatformVitePlugin({
        platform: isH5 ? 'web' : 'mp',
      }),
      crossGameStyleVitePlugin({
        styleName: subProjectConfig?.styleName || '',
        warnList: warnList ?? DEFAULT_WARN_LIST,
      }),
      addCodeAtEndVitePlugin({
        list: [
          {
            id: /vue\.runtime\.esm\.js(?!\?commonjs-proxy)/,
            code: 'export default function(){};;',
            exact: false,
          },
        ],
      }),
      basicSsl(),
      commonjs(),
      uniTailwindOptions ? uniTailwind(typeof uniTailwindOptions === 'boolean' ? undefined : uniTailwindOptions) : null,
      uni({
        vueOptions: {
          template: {
            compilerOptions: {
              isCustomElement: (tag: string) => CUSTOM_ELEMENTS.includes(tag)
              ,
            },
          },
        },
      }),
      vueJsx({}),
      isProduction ? visualizer({
        open: !!env.VITE_VISUALIZER,
        filename: path.resolve(process.env.UNI_OUTPUT_DIR || '', 'my-bundle-analyze.html'), // 分析图生成的文件名
        gzipSize: true, // 收集 gzip 大小并将其显示
        brotliSize: true, // 收集 brotli 大小并将其显示
      }) : null,
      fixUniDirVitePlugin(),
      isMpQQ ? genMpQQAppIdVitePlugin() : null,
      isMpQQ ? globalThisPolyfillVitePlugin() : null,
      isProduction ? genVersionPlugin : null,
      isH5 ? removeUseRemVitePlugin() : null,
      iRemoveVueDirectionOptions ? removeVueDirectiveVitePlugin(iRemoveVueDirectionOptions) : null,
      ...postPlugins,
    ].filter(item => item),
    optimizeDeps: {
      include: optimizeDepsIncludes,
    },
    resolve: {
      alias: {
        src: path.resolve(root, 'src'),
      },
      // preserveSymlinks: true,
    },
    server: {
      port,
      https: https ?? {},
      host,
      hmr,
    },
    define: defines,
  };
}
