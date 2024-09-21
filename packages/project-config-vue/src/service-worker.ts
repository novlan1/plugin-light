import WorkboxPlugin from 'workbox-webpack-plugin';
import { getProjectName, getSubProjectName } from '@plugin-light/shared';


export function initWorkboxPlugin(useWorkBoxPlugin: Record<string, any> = {}) {
  return new WorkboxPlugin.GenerateSW({
    swDest: `./service-worker-${getProjectName()}-${getSubProjectName()}.js`, // Service Worker 文件名
    clientsClaim: true, // Service Worker 立即接管页面控制权
    include: [/.*(.js|.css|.svg|.png|.jpg|.jpeg)/],
    skipWaiting: true, // 强制等待 Service Worker 准备就绪后再激活
    maximumFileSizeToCacheInBytes: 13 * 1024 * 1024, // 设置最大缓存文件大小为13MB，根据需要调整大小
    importScripts: [],
    inlineWorkboxRuntime: true,
    runtimeCaching: [{
      urlPattern: new RegExp('^https://image-1251917893\\.file\\.myqcloud.com.*(\\.js|\\.css|\\.svg|\\.png|\\.jpg|\\.jpeg)'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    }, {
      urlPattern: /.*\.html$/,
      handler: 'NetworkOnly',
    }],

    ...useWorkBoxPlugin,
  });
}
