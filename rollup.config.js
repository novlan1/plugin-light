
import fs from 'fs';
import path from 'path';

import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';


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

    return {
      path: path.resolve(cur),
      name: file,
    };
  });
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


export default [
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
];
