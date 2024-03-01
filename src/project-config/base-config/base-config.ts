import * as fs from 'fs';
import * as path from 'path';
import { getIPAddressStr, merge } from 't-comm';

import FileManagerPlugin from 'filemanager-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import PrerenderSpaPlugin from 'prerender-spa-plugin';
import HooksScriptPlugin from 'webpack-hooks-shellscripts';

import { HtmlModifyPlugin } from '../../webpack-plugin/modify-html/modify-html';
import { getRootDir } from '../helper/root';
import { LOADER_MAP } from '../../webpack-loader/index';

import { DEFAULT_CDN_URLS, DEFAULT_PROJECT_MAP, DEFAULT_HANDLE_IF_DEF_FILES } from './config';
import { DEFAULT_TRANSPILE_DEPENDENCIES } from '../uni-vue-config/config';


const curDirname = getRootDir();


// 获取真实的vue-app名字
function getRealVueAppDir(shadowProjectMap: Record<string, string> = {}) {
  const vueAppDir = process.env.VUE_APP_DIR || '';

  if (DEFAULT_PROJECT_MAP[vueAppDir as keyof typeof DEFAULT_PROJECT_MAP]) {
    return DEFAULT_PROJECT_MAP[vueAppDir as keyof typeof DEFAULT_PROJECT_MAP];
  }
  if (shadowProjectMap[vueAppDir as keyof typeof shadowProjectMap]) {
    return shadowProjectMap[vueAppDir as keyof typeof shadowProjectMap];
  }

  return vueAppDir || '';
}

const publishPara = process.env.publish;


const port = process.env.port || process.env.npm_config_port || 443;

function getAppName() {
  const arr = (process.env.VUE_APP_DIR || '').split('/');
  return arr[arr.length - 1];
}


// 输出路径，构建的ssr包放在ssr目录下，构建的static包放在static目录下
function getOutputPath() {
  if (process.env.VUE_APP_PLUGIN) {
    return path.resolve(curDirname, 'dist', process.env.VUE_APP_DIR || '', 'plugin');
  }
  if (process.env.VUE_APP_SSR) {
    return path.resolve(curDirname, 'dist', process.env.VUE_APP_DIR || '', 'ssr');
  }
  return path.resolve(curDirname, 'dist', process.env.VUE_APP_DIR || '', 'static');
}

// 入口：entry.js, entry-server.js, entry-client.js
function getEntry(shadowProjectMap: Record<string, string>) {
  return path.resolve(curDirname, 'src', getRealVueAppDir(shadowProjectMap), 'main.js'); // plugin的入口用自己的
}

// 获取目下所有项目文件夹名称并创建webpack别名
function getAllAppNameAlias(shadowProjectMap: Record<string, string>) {
  const files = fs.readdirSync(path.resolve(curDirname, 'src'));
  const result: Record<string, any> = {
    foldername: [], // 文件夹名字
    filename: [], // 文件名，有后缀
  };
  files.forEach((file) => {
    const pathname = path.join(curDirname, 'src', file);
    const stat = fs.lstatSync(pathname);
    if (!stat.isDirectory()) {
      result.filename.push(file);
    } else {
      result.foldername.push(file);
    }
  });
  const alias: Record<string, string> = {
    src: path.resolve(curDirname, 'src'),
    '@': path.resolve(curDirname, 'src', getRealVueAppDir(shadowProjectMap)), // 由环境变量确定当前的项目
  };
  result.foldername.forEach((dir: string) => {
    alias[dir] = path.resolve(curDirname, 'src', dir);
  });
  return alias;
}

// 需要构建时自动注入的cdn url
function getCdnInject({
  isVue3 = false,
}) {
  const objs = { // 无需溯源打包的对象。比如采用cdn引入的对象。
    mqq: 'mqq',
    wx: 'wx',
    msdkShare: 'msdkShare',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'vue-lazyload': 'VueLazyload',
  };

  // 必要的cdn写这里。构建时注入html中。（不是所有页面都要的，页面自己加载）
  let cdnUrls = DEFAULT_CDN_URLS;

  if (isVue3) {
    cdnUrls = [
      'https://unpkg.com/vue@3.2.31/dist/vue.runtime.global.prod.js',
      'https://unpkg.com/vue-router@4.0.14/dist/vue-router.global.js',
      'https://unpkg.com/vuex@4.0.2/dist/vuex.global.js',
      ...cdnUrls.slice(3),
    ];
  }

  return { objs, cdnUrls };
}

export function getWebpackBaseConfig(options?: Record<string, any>) {
  const {
    isUseVueLoader,
    isVue3,
    useXSS,
    useIfDefLoader,
    handleIfDefFiles,
    shadowProjectMap = {},
  } = merge({}, {
    isUseVueLoader: true,
    isVue3: false,
    useXSS: true,
    useIfDefLoader: true,
    handleIfDefFiles: DEFAULT_HANDLE_IF_DEF_FILES,
  }, options || {});

  let terserPureFuncs = ['console.log', 'console.table'];
  let transpileDependencies = DEFAULT_TRANSPILE_DEPENDENCIES;

  if (options?.terserPureFuncs) {
    terserPureFuncs = options.terserPureFuncs || [];
  }
  if (options?.transpileDependencies) {
    transpileDependencies = options.transpileDependencies;
  }

  const config = {
    publicPath: process.env.VUE_APP_PUBLICPATH, // 部署应用包时的基本URL
    outputDir: getOutputPath(), // build时输出的文件目录
    assetsDir: '', // 放置静态文件夹目录
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false, // 生产环境是否生成sourceMap
    transpileDependencies,
    parallel: false,
    css: {
      extract: false,
    }, // css文件强制内联
    devServer: {
      port, // 开发运行时的端口
      https: true, // 是否启用https
      proxy: {
        '/pvp/share/getsharecfg': {
          target: 'https://igame.qq.com',
          changeOrigin: true,
          ws: true,
        },
        '/pvp/share/gethash': {
          target: 'https://igame.qq.com',
          changeOrigin: true,
          ws: true,
        },
      },
      disableHostCheck: (process.env.NODE_ENV || '').startsWith('development'),
    },
    configureWebpack: {
      entry: getEntry(shadowProjectMap),
      name: getAppName(),
      resolve: {
        alias: getAllAppNameAlias(shadowProjectMap),
        extensions: ['js', 'vue', 'json', 'ts'],
      },
      // 可用来测试webpack运行时机制
      // optimization: {
      //   minimize: false,
      //   runtimeChunk: { name: 'runtime' },
      // },
    },
    chainWebpack(config: any) {
      config.module.rule('vue')
        .uses
        .delete('cache-loader');
      config.module.rule('js')
        .uses
        .delete('cache-loader');
      config.module.rule('ts')
        .uses
        .delete('cache-loader');
      config.module.rule('tsx')
        .uses
        .delete('cache-loader');

      if (useIfDefLoader) {
        config.module
          .rule('ifdef-loader')
        // 根据项目实际配置文件类型
          .test(handleIfDefFiles)
        // 不要配成下面这样，会卡住
        // .test(/\.vue|\.ts|\.js|\.css|\.scss$/)
          .use(LOADER_MAP.ifdef)
          .loader(LOADER_MAP.ifdef)
          .options({
            context: { H5: true },
            type: ['css', 'js', 'html'],
          })
          .end();
      }

      // 先暂时去掉eslint
      config.module.rule('eslint')
        .uses
        .clear();

      config
        .when(
          process.env.PUBLISH_ENV !== 'test',
          (config: any) => {
            // 去掉console.log
            config.optimization.minimizer('terser')
              .tap((args: any) => {
              // remove debugger
                args[0].terserOptions.compress.drop_debugger = true;
                // 移除 console.log
                args[0].terserOptions.compress.pure_funcs = terserPureFuncs;
                // 去掉注释 如果需要看chunk-vendors公共部分插件，可以注释掉就可以看到注释了
                args[0].terserOptions.output = {
                  comments: false,
                };
                return args;
              });
          },
        );

      // config.plugins.delete('preload'); // 这个不禁止，预加载很快会被用到的内容
      config.plugins.delete('prefetch'); // 这个禁止掉，首屏不预加载其他路由的js，需要预加载的路由，引入的时候，加上/* webpackPrefetch: true */

      config.plugin('preload')
        .use('@vue/preload-webpack-plugin')
        .tap(() => [{
          rel: 'preload',
          // 不写这个runtime.js会被打包进去
          fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
          include: 'initial',
        }]);

      if (process.env.npm_config_report) {
        console.log('进行包分析');
        config
          .plugin('webpack-bundle-analyzer')
          .use(BundleAnalyzerPlugin)
          .end();
      } else if (process.env.NODE_ENV !== 'development') {
        config
          .plugin('webpack-bundle-analyzer')
          .use(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'my-bundle-analyze.html',
          }))
          .end();
      }

      // set preserveWhitespace
      config.module
        .rule('vue')
        .test(/\.vue$/)
        .use(LOADER_MAP.crossGameStyle, LOADER_MAP.crossPlatformProd) // 处理样式的loader，必须在vue-loader前执行
        .loader(LOADER_MAP.crossGameStyle, LOADER_MAP.crossPlatformProd)
        .end();


      if (isUseVueLoader) {
        config.module
          .rule('vue')
          .test(/\.vue$/)
          .use('vue-loader')
          .loader('vue-loader')
          .tap((options: any) => {
            if (options) {
              options.compilerOptions.whitespace = 'preserve';
            }
            return options;
          })
          .tap((options: any) => {
            if (useXSS) {
              options.compilerOptions.directives = {
                html(node: any, directiveMeta: any) {
                  (node.props || (node.props = [])).push({
                    name: 'innerHTML',
                    value: `xss ? xss(_s(${directiveMeta.value})) : ${directiveMeta.value}`,
                  });
                },
              };
            }
            return options;
          })
          .end();
      }

      config.module
        .rule('js')
        .test(/\.[jt]s$/)
        .use(LOADER_MAP.crossPlatform) // 处理样式的loader，必须在vue-loader前执行
        .loader(LOADER_MAP.crossPlatform)
        .end();

      config
      // https://webpack.js.org/configuration/devtool/#development
        .when(
          process.env.NODE_ENV === 'development',
          (config: any) => config.devtool('cheap-source-map'),
        );

      config
        .when(
          process.env.NODE_ENV !== 'development',
          (config: any) => {
            config
              .plugin('ScriptExtHtmlWebpackPlugin')
              .after('html')
              .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
                inline: /runtime\..*\.js$/,
              }])
              .end();
            config
              .optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                  libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial', // only package third parties that are initially dependent
                  },
                  elementUI: {
                    name: 'chunk-elementUI', // split elementUI into a single package
                    // the weight needs to be larger than libs and app or it will be packaged into libs or app
                    priority: 20,
                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
                  },
                  comm: {
                    name: 'chunk-comm',
                    test: /[\\/]src[\\/]_?comm(.*)/,
                    minChunks: 2,
                    minSize: 10 * 1024,
                    maxSize: 244 * 1024,
                    priority: 5,
                    reuseExistingChunk: true,
                  },
                  component: {
                    name: 'chunk-component',
                    test: /[\\/]src[\\/]_?component(.*)/,
                    minChunks: 2,
                    minSize: 10 * 1024,
                    maxSize: 244 * 1024,
                    priority: 5,
                    reuseExistingChunk: true,
                  },
                  logic: {
                    name: 'chunk-logic',
                    test: /[\\/]src[\\/]_?logic(.*)/,
                    minChunks: 2,
                    minSize: 10 * 1024,
                    maxSize: 244 * 1024,
                    priority: 5,
                    reuseExistingChunk: true,
                  },
                },
              });
            config.optimization.runtimeChunk('single');
          },
        );

      let serving = false;
      process.argv.forEach((i) => {
        if (i.indexOf('--serving') == 0) {
          serving = true;
        }
      });

      // 指定html模板文件
      config.plugin('html')
        .tap((args: any) => { // https://github.com/vuejs/vue-cli/blob/dev/docs/zh/guide/webpack.md
          args[0].template = path.resolve(curDirname, 'src', getRealVueAppDir(shadowProjectMap) || 'comm', 'index.html'); // 业务目录下自己的模板。默认在vue-cli3/public/index.html
          args[0].minify = false; // 不需要压缩，没几个字节，不压缩方便后续处理
          return args;
        });

      // config.when(process.env.NODE_ENV !== 'hotreload', config => {
      if (!serving) {
        console.log(`--------not serving now: ${process.env.NODE_ENV}----------`);
        // html后处理：title替换，cdnurl自动注入。自定义HtmlmodifyPlugin插件
        config.plugin('Htmlmodify')
          .use(new (HtmlModifyPlugin as any)({
            onEnd: {
              html: [{
                source: path.resolve(curDirname, 'src', getRealVueAppDir(shadowProjectMap), 'index.html'),
                destination: `${getOutputPath()}/index.html`,
                ssr: process.env.VUE_APP_SSR,
                urls: getCdnInject({ isVue3 }).cdnUrls,
              }],
            },
          }))
          .tap((args: any) => args);

        if (process.env.npm_config_prerender) {
          console.log('开始预渲染');
          config
            .plugin('prerender-spa-plugin')
            .use(PrerenderSpaPlugin, [
              {
              // 生成文件的路径，也可以与webpakc打包的一致。
              // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
                staticDir: path.join(curDirname, './dist'),
                outputDir: getOutputPath(),
                indexPath: `${getOutputPath()}/index.html`,
                routes: ['/', '/index'],
                renderer: new (PrerenderSpaPlugin.PuppeteerRenderer)({
                  inject: {
                    initLocation: false, // 是否初始化定位组件，为false不会渲染定位相关
                  },
                  // headless: false,
                  renderAfterTime: 10000,
                // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
                // renderAfterDocumentEvent: 'render-event',
                }),
              },
            ])
            .end();
        }

        // 打包构建后的文件
        config.plugin('FileManager')
          .use(new FileManagerPlugin({
            onEnd: [{
              archive: [{
                source: getOutputPath(),
                destination: `${getOutputPath()}/static_${getAppName()}_${getIPAddressStr()}.tar`,
                format: 'tar',
              }],
            }],
          }))
          .tap((args: any) => args);

        /* 申明外部全局变量
              不经常改动的库、我们通过cdn引入. require('Vue')或者import('Vue') 时webpack不对他们进行打包，
              可以减少代码的大小、也可以减少服务器的带宽，更能把这些文件缓存到客户端，客户端加载的会更快。
           */
        config.externals(getCdnInject({ isVue3 }).objs);

        if (publishPara == 'test') {
          console.log('编译并发布到测试环境');
          config
            .plugin('webpack-hooks-shellscripts')
            .use(HooksScriptPlugin({
              beforeRun: [
              ],
              afterEmit: [
                `node ${LOADER_MAP.publishUtil}`,
              ],
            }))
            .end();
        } else if (publishPara == 'prod') {
          console.log('编译并发布到正式环境');
          config
            .plugin('webpack-hooks-shellscripts')
            .use(HooksScriptPlugin({
              beforeRun: [
              ],
              afterEmit: [
                `node ${LOADER_MAP.publishUtil} prod`,
              ],
            }))
            .end();
        } else {
          console.log('只编译不发布');
          config
            .plugin('webpack-hooks-shellscripts')
            .use(HooksScriptPlugin({
              beforeRun: [
              ],
              afterEmit: [
              ],
            }))
            .end();
        }
      // })
      }
    },
  };

  return config;
}


