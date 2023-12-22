
import fs from 'fs';
import path from 'path';

import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import dts from 'rollup-plugin-dts';


const LOADER_DIR = './src/loader';
const BUNDLE_DIR = 'lib';
const DEFAULT_PLUGINS = [
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'runtime',
    // 只转换源代码，不运行外部依赖
    exclude: 'node_modules/**',
    // babel 默认不支持 ts 需要手动添加
    extensions: [...DEFAULT_EXTENSIONS, '.ts'],
  }),
  typescript({
    sourceMap: false,
    tsconfig: './tsconfig.json',
  }),
];

const EXTERNALS =  [
  'fs',
  'path',
  't-comm',
  '@dcloudio/uni-cli-shared/lib/cache',
  'loader-utils',
  'vue-template-compiler',
  'glob-to-regexp',
  'xregexp',

  'filemanager-webpack-plugin',
  'webpack-bundle-analyzer',
  'prerender-spa-plugin',
  'webpack-hooks-shellscripts',
  'uni-read-pages',
  'webpack',
  'uni-plugin-light',
  'plugin-light',
];

function getLoaderFiles() {
  const files = fs.readdirSync(LOADER_DIR);
  const loaderFiles = files.map((file) => {
    const cur = `${LOADER_DIR}/${file}`;

    if (fs.statSync(cur).isDirectory()) {
      return {
        path: path.resolve(cur, 'index.ts'),
        name: file,
      };
    }

    // return {
    //   path: path.resolve(cur),
    //   name: file,
    // };
  }).filter(item => !!item);
  return loaderFiles;
}


function getLoaderConfig() {
  const files = getLoaderFiles();
  const res = files
    .map(file => ({
      input: file.path,
      output: {
        dir: `${BUNDLE_DIR}/loader`,
        format: 'cjs',
        entryFileNames: `${file.name}.js`,
        exports: 'auto',
      },
      external: [
        ...EXTERNALS,
      ],
      plugins: [
        // json(),
        ...DEFAULT_PLUGINS,
      ],
    }))
    .concat(files.map(file => ({
      input: file.path,
      output: {
        dir: `${BUNDLE_DIR}/loader`,
        format: 'cjs',
        entryFileNames: `${file.name}.prod.js`,
        exports: 'auto',
      },
      external: [
        ...EXTERNALS,
      ],
      plugins: [
        ...DEFAULT_PLUGINS,
        terser(),
      ],
    })));
  return res;
}


const rollUpConfigList = [
  {
    input: './src/plugin/index.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'plugin.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
    ],
  },
  {
    input: './src/plugin/index.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'plugin.prod.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
      terser(),
    ],
  },
  {
    input: './src/loader/index.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'loader.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      json(),
      ...DEFAULT_PLUGINS,
    ],
  },
  {
    input: './src/task/index.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'task.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
    ],
  },
  {
    input: './src/webpack/base-config/index.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'webpack-base-config.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      json(),
      ...DEFAULT_PLUGINS,
    ],
  },
  {
    input: './src/webpack/uni-vue-config/index.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'uni-vue-config.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      json(),
      ...DEFAULT_PLUGINS,
    ],
  },
  {
    input: './src/webpack/base-config/publish.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'webpack-publish.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
    ],
  },
  ...getLoaderConfig(),
  {
    input: './script/post-install/index.ts',
    output: {
      dir: BUNDLE_DIR,
      format: 'cjs',
      entryFileNames: 'post-install.js',
    },
    external: [
      ...EXTERNALS,
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
    ],
  },
];

const dtsConfigList = rollUpConfigList
  .filter(item => item.output?.entryFileNames !== 'post-install.js'
   && item.output.dir !== `${BUNDLE_DIR}/loader`)
  .map(item => ({
    ...item,
    output: {
      ...item.output,
      entryFileNames: item.output.entryFileNames.replace(/\.js$/, '.d.ts'),
    },
    plugins: [
      json(),
      dts(),
    ],
  }));

export default [
  ...rollUpConfigList,
  ...dtsConfigList,
];
