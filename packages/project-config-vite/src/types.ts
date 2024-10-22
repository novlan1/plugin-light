import type { IAddCodeAtEndOptions } from '@plugin-light/vite-plugin-add-code-at-end';
import type { IAliasForLibraryOptions } from '@plugin-light/vite-plugin-alias-for-library';

export type GetViteConfigOptions = {
  // 模式，对应 Vite 中 defineConfig 的 mode 参数
  mode: string;

  // 本地开发端口
  serverPort?: number;
  // 本地开发是否是 https
  serverHttps?: boolean;
  // 参考 https://cn.vitejs.dev/config/server-options.html#server-host
  serverHost?: string | boolean;

  // 对应 optimizeDeps.include
  optimizeDepsIncludes?: Array<string>;
  // 对应 optimizeDeps.exclude
  optimizeDepsExcludes?: Array<string>;

  // add-code-at-end 插件参数
  addCodeAtEndOptions?: IAddCodeAtEndOptions;

  // 是否使用 press-ui 本地的 alias 配置
  pressUiAlias?: string;
  pressPlusAlias?: string;

  // alias-for-library 插件参数
  aliasForLibraryOptions?: IAliasForLibraryOptions;

  // pmd-tools 之类的别名映射
  pmdAliasMap?: Record<string, string>;

  customElements?: Array<string>;

  // 三方库是否使用 cdn 链接，比如 vue，vue-router
  useCdn?: boolean;
  useElementPlusCDN?: boolean;
};
