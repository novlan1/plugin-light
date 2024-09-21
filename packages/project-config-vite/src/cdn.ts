import { cdn } from 'vite-plugin-cdn2';
import { AEGIS_EXTERNAL_SCRIPT_LINK } from '@plugin-light/shared';


export function enableCDN(isEnabled: string) {
  if (isEnabled === 'true') {
    return cdn({
      // url 可以更换为私有或其他源
      // url: "https://cdn.jsdelivr.net/npm/",
      url: 'https://unpkg.com/',
      modules: ['vue', 'vue-demi', 'pinia', 'axios', 'vant', 'vue-router'],
    });
  }
}

export const getCdnList = ({
  useElementPlusCDN,
}: {
  useElementPlusCDN?: Boolean
}) => {
  const modules: Array<{
    name: string;
    var: string;
    path: string;
    css?: string;
  }> = [
    {
      name: 'vue',
      var: 'Vue',
      path: 'https://image-1251917893.file.myqcloud.com/igame/npm/vue@3.3.6/vue.runtime.global.prod.js',
    },
    {
      name: 'vue-demi',
      var: 'VueDemi',
      path: 'https://image-1251917893.file.myqcloud.com/igame/npm/vue-demi@0.14.6/index.iife.min.js',
    },
    {
      name: 'vue-router',
      var: 'VueRouter',
      path: 'https://image-1251917893.file.myqcloud.com/igame/npm/vue-router@4.2.5/vue-router.global.prod.js',
    },
    {
      name: 'aegis-web-sdk',
      var: 'Aegis',
      path: AEGIS_EXTERNAL_SCRIPT_LINK,
    },
    {
      name: 'pinia',
      var: 'Pinia',
      path: 'https://image-1251917893.file.myqcloud.com/igame/npm/pinia@2.1.7/pinia.iife.min.js',
    },

  ];

  if (useElementPlusCDN) {
    modules.push({
      name: 'element-plus',
      var: 'ElementPlus',
      css: 'https://image-1251917893.cos.ap-guangzhou.myqcloud.com/igame/npm/element-plus/element-plus%402.7.8.css',
      path: 'https://image-1251917893.cos.ap-guangzhou.myqcloud.com/igame/npm/element-plus/element-plus%402.7.8.js',
    });
  }

  return {
    modules,
  };
};
