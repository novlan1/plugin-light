
import fs from 'fs';
import path from 'path';

import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';


const LOADER_DIR = './loader';
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
  const res = files.map(file => ({
    input: file.path,
    output: {
      dir: 'dist/loader',
      format: 'cjs',
      entryFileNames: `${file.name}.cjs.js`,
    },
    external: [
      't-comm',
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
    ],
  })).concat(files.map(file => ({
    input: file.path,
    output: {
      dir: 'dist/loader',
      format: 'cjs',
      entryFileNames: `${file.name}.prod.cjs.js`,
    },
    external: [
      't-comm',
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
    input: './plugin/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: 'plugin.cjs.js',
    },
    external: [
      't-comm',
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
    ],
  },
  {
    input: './plugin/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: 'plugin.prod.cjs.js',
    },
    external: [
      't-comm',
    ],
    plugins: [
      ...DEFAULT_PLUGINS,
      terser(),
    ],
  },
  ...getLoaderConfig(),
];
