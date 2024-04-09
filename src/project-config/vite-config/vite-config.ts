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

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import basicSsl from '@vitejs/plugin-basic-ssl';
import commonjs from 'vite-plugin-commonjs';
import { enableCDN } from './cdn';

import type { GetViteConfigOptions } from './types';
import { ifdefVitePlugin } from '../../vite-plugin/ifdef';
import { crossPlatformVitePlugin } from '../../vite-plugin/cross-platform';
import { addCodeAtEndVitePlugin } from '../../vite-plugin/add-code-at-end';
import { aliasForLibrary } from '../../vite-plugin/alias-for-library';
import { crossGameStyleVitePlugin } from '../../vite-plugin/cross-game-style';
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
}: GetViteConfigOptions) {
  // 环境变量
  const env = loadEnv(mode, root, ENV_PREFIX);
  const appDir = env.VUE_APP_DIR || '';

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
  ].filter(item => !!item);

  return {
    root: subProjectRoot,
    base: env.VUE_APP_PUBLICPATH || './',
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
