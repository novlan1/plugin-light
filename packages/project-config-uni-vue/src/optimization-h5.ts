import * as path from 'path';
import type { GetUniVueConfig  } from './types';


export function optimizationH5(useH5SplitChunks: GetUniVueConfig['useH5SplitChunks']) {
  const {
    getMainEntry,
    getH5Options,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  } = require('@dcloudio/uni-cli-shared');

  const {
    title,
    publicPath,
    template,
  } = getH5Options();


  return {
    pages: {
      index: {
        entry: path.resolve(process.env.UNI_INPUT_DIR!, getMainEntry()),
        // 模板来源
        template,
        filename: 'index.html',
        title,
        publicPath,
        chunks: [
          'uni-h5',
          'core-js',
          'vue-cli-plugin-uni',
          'chunk-vendors',
          'index',
          'runtime',
          // 'tencent-cloud-chat',
          'pmd-vue',
        ],
      },
    },
    chainWebpack(config: any) {
      config.optimization.splitChunks({
        // chunks: 'all',
        minChunks: 1,
        maxInitialRequests: 20,
        // maxAsyncRequests: 30,

        cacheGroups: {
          tim_js_sdk: {
            name: 'tim-js-sdk',
            test: /[\\/]node_modules[\\/]_?tim-js-sdk(.*)/,
            priority: 15,
            chunks: 'all',
            // minSize: 0,
            reuseExistingChunk: true,
          },
          tencent_cloud_chat: {
            name: 'tencent-cloud-chat',
            test: /node_modules[\\/]_?@tencentcloud[\\/]_?chat/,
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          pmd_vue: {
            name: 'pmd-vue',
            test: /node_modules[\\/]_?@tencent[\\/]_?pmd-vue/,
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          uni_h5: {
            name: 'uni-h5',
            test: /node_modules(.*)uni-h5(.*)/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          vue_cli_plugin_uni: {
            name: 'vue-cli-plugin-uni',
            test: /vue-cli-plugin-uni[\\/]_?packages/,
            chunks: 'initial',
            priority: 30,
            reuseExistingChunk: true,
          },
          core_js: {
            name: 'core-js',
            test: /[\\/]node_modules[\\/]_??core-js(.*)/,
            chunks: 'initial',
            priority: 30,
            reuseExistingChunk: true,
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          // index_home: {
          //   name: 'index-home',
          //   test: path.resolve('src/project/user/views/index'),
          //   priority: 60,
          //   chunks: 'all',
          //   reuseExistingChunk: true,
          // },
        },
        ...(typeof useH5SplitChunks === 'boolean' ? {} : useH5SplitChunks),
      });
    },
  };
}
