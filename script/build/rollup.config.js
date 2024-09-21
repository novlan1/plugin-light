// import fs from 'fs';
import path from 'path';

import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

// import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { getDeps } from 't-comm';


const BUNDLE_DIR = 'lib';


export function getRollupConfig(dir, externals = []) {
  // if (fs.existsSync(path.resolve(dir, '.babelrc'))) {
  //   fs.unlinkSync(path.resolve(dir, '.babelrc'));
  // }
  const DEFAULT_PLUGINS = [
    resolve(),
    commonjs(),
    // babel({
    //   // babelHelpers: 'runtime',
    //   // // 只转换源代码，不运行外部依赖
    //   // exclude: '**/node_modules/**',
    //   // // babel 默认不支持 ts 需要手动添加
    //   // extensions: [...DEFAULT_EXTENSIONS, '.ts'],
    // }),
    typescript({
      sourceMap: false,
      tsconfig: path.resolve(dir, './tsconfig.json'),
    }),
  ];

  const EXTERNALS =  [
    ...getDeps(dir),
    '@babel/traverse',
    '@babel/generator',
    '@babel/parser',
    '@babel/types',
    'vite',
    'webpack',
    ...externals,
  ];

  const rollUpConfigList = [
    {
      input: path.resolve(dir, './src/index.ts'),
      output: {
        dir: BUNDLE_DIR,
        format: 'cjs',
        entryFileNames: 'index.js',
      },
      external: [
        ...EXTERNALS,
      ],
      plugins: [
        json(),
        ...DEFAULT_PLUGINS,
      ],
    },
  ];


  return rollUpConfigList;
}
