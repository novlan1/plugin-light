import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const plugins = [
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
      ...plugins,
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
      ...plugins,
      terser(),
    ],
  },
  // {
  //   input: './plugin/gen-version-plugin/index.js',
  //   output: {
  //     dir: 'dist',
  //     format: 'esm',
  //     entryFileNames: '[name].esm.js',
  //   },
  //   external: [
  //     't-comm',
  //   ],
  //   plugins: [
  //     resolve(),
  //     commonjs(),
  //     typescript({
  //       sourceMap: false,
  //     }),
  //     terser(),
  //   ],
  // },
];
