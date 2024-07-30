import path from 'path';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// eslint-disable-next-line import/no-unresolved
import Components from 'unplugin-vue-components/vite';
// eslint-disable-next-line import/no-unresolved
import { VantResolver } from 'unplugin-vue-components/resolvers';
// eslint-disable-next-line import/no-unresolved
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// eslint-disable-next-line import/no-unresolved
import AutoImport from 'unplugin-auto-import/vite';
import { BUILD_NAME_MAP } from 't-comm/lib/v-console/config';
import { removeLastSlash } from 't-comm/lib/slash/slash';

import { visualizer } from 'rollup-plugin-visualizer';
import importToCDN from 'vite-plugin-cdn-import';
import legacy from '@vitejs/plugin-legacy';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import basicSsl from '@vitejs/plugin-basic-ssl';
import commonjs from 'vite-plugin-commonjs';
import { enableCDN, getCdnList } from './cdn';

import type { GetViteConfigOptions } from './types';
import { ifdefVitePlugin } from '../../vite-plugin/ifdef';
import { crossPlatformVitePlugin } from '../../vite-plugin/cross-platform';
import { addCodeAtEndVitePlugin } from '../../vite-plugin/add-code-at-end';
import { aliasForLibrary } from '../../vite-plugin/alias-for-library';
import { crossGameStyleVitePlugin } from '../../vite-plugin/cross-game-style';
import { genVersionWebVitePlugin } from '../../vite-plugin/gen-version/web';
import {
  DEFAULT_OPTIMIZE_DEPS_INCLUDES,
  DEFAULT_OPTIMIZE_DEPS_EXCLUDES,
  DEFAULT_ADD_CODE_AT_END_OPTIONS,
  DEFAULT_ALIAS_FOR_LIBRARY_OPTIONS,
  DEFAULT_ALIAS,
  getDefaultPmdAliasMap,
} from './config';


const ENV_PREFIX = ['VITE_', 'VUE_APP'];

// 当前工作目录路径
const root: string = process.cwd();

function getAlias({
  subProjectRoot,
  pressUiAlias,
  pressPlusAlias,
  pmdAliasMap,
}: {
  subProjectRoot: string;
  pressUiAlias: string;
  pressPlusAlias: string;
  pmdAliasMap?: Record<string, string>
}) {
  const result: Record<string, string> = {
    '@': subProjectRoot,
    src: path.resolve(root, 'src'),
    ...(pmdAliasMap || {}),
  };

  if (pressUiAlias) {
    result['press-ui'] = path.resolve(root, pressUiAlias);
  }
  if (pressPlusAlias) {
    result['press-plus'] = path.resolve(root, pressPlusAlias);
  }

  return result;
}

function getSubProjectConfig(subProjectRoot: string) {
  let res: Record<string, any> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    res = require(path.resolve(subProjectRoot, 'config.js'));
  } catch (err) {}
  return res;
}


export function getViteBaseConfig({
  mode,
  serverHttps = true,
  serverPort = 443,
  serverHost = true,

  optimizeDepsIncludes,
  optimizeDepsExcludes,
  addCodeAtEndOptions,

  pressUiAlias = DEFAULT_ALIAS.PRESS_UI,
  pressPlusAlias = DEFAULT_ALIAS.PRESS_PLUS,
  aliasForLibraryOptions = DEFAULT_ALIAS_FOR_LIBRARY_OPTIONS,
  pmdAliasMap = getDefaultPmdAliasMap(root),
  customElements = [],

  useCdn = true,
  useElementPlusCDN = false,
}: GetViteConfigOptions) {
  // 环境变量
  const env = loadEnv(mode, root, ENV_PREFIX);
  const isProduction = mode === 'production';

  const appDir = env.VUE_APP_DIR || '';
  const vueAppBase = env.VUE_APP_PUBLICPATH;


  let subProjectRoot = `${path.resolve(root, `./src/${appDir}`)}/`;
  if (!appDir) {
    subProjectRoot = path.resolve(root, './src/');
  }

  const subProjectConfig =  getSubProjectConfig(subProjectRoot);

  const plugins = [
    aliasForLibrary({
      root,
      ...(aliasForLibraryOptions || {}),
    }),
    ifdefVitePlugin({
      context: { H5: true, VUE3: true },
      type: ['css', 'js', 'html'],
    }),
    crossPlatformVitePlugin({
      platform: 'web',
    }),
    crossGameStyleVitePlugin({
      styleName: subProjectConfig?.styleName || '',
    }),
    addCodeAtEndVitePlugin(addCodeAtEndOptions || DEFAULT_ADD_CODE_AT_END_OPTIONS),
    serverHttps ? basicSsl() : '',
    commonjs(),
    vue({
      template: {
        compilerOptions: {
          // @ts-ignore
          isCustomElement: (tag: string) => customElements.includes(tag),
        },
      },
    }),
    vueJsx(),
    mockDevServerPlugin(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // vant 组件自动按需引入
    Components({
      dts: 'typings/components.d.ts',
      resolvers: [
        VantResolver(),
        ElementPlusResolver(),
      ],
    }),
    // svg icon
    createSvgIconsPlugin({
      // 指定图标文件夹
      iconDirs: [path.resolve(subProjectRoot, './icons/svg')],
      // 指定 symbolId 格式
      symbolId: 'icon-[dir]-[name]',
    }),
    // 允许 setup 语法糖上添加组件名属性
    vueSetupExtend(),
    // 生产环境 gzip 压缩资源
    viteCompression(),
    // 注入模板数据
    createHtmlPlugin({
      inject: {
        data: {
          ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || 'false',
        },
      },
    }),
    // 生产环境默认不启用 CDN 加速
    enableCDN(env.VITE_CDN_DEPS),
    genVersionWebVitePlugin({
      buildName: BUILD_NAME_MAP.build,
      commitName: BUILD_NAME_MAP.commit,
      delay: 10,
    }),
    legacy({
      targets: ['> 1%, last 1 version, ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
    }),
    isProduction && useCdn ? importToCDN(getCdnList({
      useElementPlusCDN,
    })) : null,
    isProduction ? visualizer({
      open: !!env.VITE_VISUALIZER,
      filename: path.resolve(subProjectRoot, 'dist', 'stats.html'), // 分析图生成的文件名
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true, // 收集 brotli 大小并将其显示
    }) : null,
  ].filter(item => !!item);


  const experimentalConfig = vueAppBase ? {
    experimental: {
      renderBuiltUrl(filename: string, { hostId, hostType, type }: {
        hostId: string;
        hostType: string;
        type: string;
      }) {
        console.log('[experimental] ', hostType, hostId, type, filename);

        return `${removeLastSlash(vueAppBase)}/${filename}`;
      },
    },
  } : {};


  return {
    root: subProjectRoot,
    envDir: process.cwd(),
    base: vueAppBase || './',
    ...experimentalConfig,
    optimizeDeps: {
      // include: ["press-ui/**/*.vue"]
      include: optimizeDepsIncludes || DEFAULT_OPTIMIZE_DEPS_INCLUDES,
      exclude: optimizeDepsExcludes || DEFAULT_OPTIMIZE_DEPS_EXCLUDES,
    },
    plugins,
    resolve: {
      alias: getAlias({
        subProjectRoot,
        pressUiAlias,
        pressPlusAlias,
        pmdAliasMap,
      }),
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      port: serverPort,
      https: serverHttps,
      host: serverHost,
      // 仅在 proxy 中配置的代理前缀， mock-dev-server 才会拦截并 mock
      // doc: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
      proxy: {
        // '^/dev-api': {
        //   target: '',
        // },
      },
    },
    build: {
      target: 'es2015',
      rollupOptions: {
        input: {
          1: path.resolve(subProjectRoot, './index.html'),
        },
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  };
}
