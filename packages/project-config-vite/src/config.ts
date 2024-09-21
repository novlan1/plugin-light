import path from 'path';
export const DEFAULT_OPTIMIZE_DEPS_INCLUDES = [
  // 'md5',
  // 'md5.js',
  // 'js-cookie',
  // 'qs',
  // 'axios',
];

export const DEFAULT_OPTIMIZE_DEPS_EXCLUDES = [
  // 'pmd-tools',
  // 'pmd-config',
  // 'pmd-report',
  // 'pmd-network',
  // 'pmd-widget',
];

export const DEFAULT_ADD_CODE_AT_END_OPTIONS = {
  list: [
    {
      id: 'vue.js',
      code: 'export default function(){}',
      exact: false,
    },
    {
      id: 'vue.runtime.esm-bundler.js',
      code: 'export default function(){}',
      exact: false,
      number: 1,
    },
  ],
};

export const DEFAULT_ALIAS_FOR_LIBRARY_OPTIONS = {
  list: [
    'press-ui',
    'press-plus',

    'pmd-aegis',
    'pmd-app-info',
    'pmd-config',
    'pmd-location',
    'pmd-login',
    'pmd-network',
    'pmd-report',
    'pmd-tools',
    'pmd-types',
    'pmd-widget',
    'pmd-vue',
    'pmd-jsapi',
  ],
  target: 'src/library',
};

export const DEFAULT_ALIAS = {
  PRESS_UI: 'src/library/press-ui',
  PRESS_PLUS: 'src/library/press-plus',
};

export const getDefaultPmdAliasMap = (root: string) => [
  'pmd-aegis',
  'pmd-app-info',
  'pmd-config',
  'pmd-location',
  'pmd-login',
  'pmd-network',
  'pmd-report',
  'pmd-tools',
  'pmd-types',
  'pmd-widget',
  'pmd-vue',
  'pmd-jsapi',
].reduce((acc: Record<string, string>, item) => {
  const list = item.split('/');
  const libName = list[list.length - 1];
  acc[item] = path.resolve(root, `src/library/${libName}`);
  return acc;
}, {});
