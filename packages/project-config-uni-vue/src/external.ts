import { checkH5, EXTERNAL_LINK_MAP } from '@plugin-light/shared';
import type { GetUniVueConfig } from './types';

export function getExternals({
  aegisWebSdkExternal,
  uniSimpleRouterExternal,
  axiosExternal,
  vueLazyloadExternal,
}: {
  aegisWebSdkExternal?: boolean | string;
  uniSimpleRouterExternal?: boolean | string;
  axiosExternal?: boolean | string;
  vueLazyloadExternal?: boolean | string;
}) {
  const externals: Record<string, string> = {};

  if (checkH5()) {
    if (aegisWebSdkExternal) {
      externals['aegis-web-sdk'] = 'window Aegis';
    }
    if (uniSimpleRouterExternal) {
      externals['uni-simple-router'] = 'Router';
    }
    if (axiosExternal) {
      externals.axios = 'axios';
    }
    if (vueLazyloadExternal) {
      externals['vue-lazyload'] = 'VueLazyload';
    }
  }


  return externals;
}


export function getExternalScripts({
  uniSimpleRouterExternal,
  aegisWebSdkExternal,
  axiosExternal,
  vueLazyloadExternal,
}: Pick<GetUniVueConfig,
'uniSimpleRouterExternal' | 'aegisWebSdkExternal' | 'axiosExternal' | 'vueLazyloadExternal'
>) {
  const externalScripts: Array<string> = [];
  insertScript(externalScripts, EXTERNAL_LINK_MAP.AEGIS_WEB,  aegisWebSdkExternal);
  insertScript(externalScripts, EXTERNAL_LINK_MAP.AXIOS, axiosExternal);
  insertScript(externalScripts, EXTERNAL_LINK_MAP.UNI_SIMPLE_ROUTER,  uniSimpleRouterExternal);
  insertScript(externalScripts, EXTERNAL_LINK_MAP.VUE_LAZY_LOAD,  vueLazyloadExternal);

  return externalScripts;
}


function insertScript(externalScripts: Array<string>, defaultScript: string, key?: boolean | string) {
  if (typeof key === 'string') {
    externalScripts.push(key);
  } else if (key) {
    externalScripts.push(defaultScript);
  }
}
