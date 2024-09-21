import type { Plugin, ServerOptions, CommonServerOptions } from 'vite';
import type { IRemoveVueDirectionOptions } from '@plugin-light/vite-plugin-remove-vue-directive';
import type { Server } from 'node:https';
import type { ICrossGameStyleOptions } from '@plugin-light/vite-plugin-cross-game-style';

export interface IUniViteConfigOptions {
  mode: string;
  uni: any;

  // 端口，传递给 server.port
  port?: CommonServerOptions['port'];
  // https 配置，传递给 server.https
  https?: Server;
  // host 配置，传递给 server.host
  host?: CommonServerOptions['host'];

  // 前置插件
  prePlugins?: Array<Plugin>;
  // 后置插件
  postPlugins?: Array<Plugin>;

  // 对应 optimizeDeps.include
  optimizeDepsIncludes?: Array<string>;

  removeVueDirectionOptions?: IRemoveVueDirectionOptions;

  hmr?: ServerOptions['hmr'];

  // 语法警报列表，比如 v-model，destroyed
  warnList?: ICrossGameStyleOptions['warnList'];
}
