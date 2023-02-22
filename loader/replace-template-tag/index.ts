import { replaceAllPolyfill } from 't-comm';
import { getOptions } from 'loader-utils';


export default function replaceTmpTag(source) {
  replaceAllPolyfill();

  // @ts-ignore
  const options = getOptions(this) || {};
  const { replaceTmpTagMap = {} } = options;

  const type = (process.env.VUE_APP_PLATFORM === 'mp-weixin' || process.env.VUE_APP_PLATFORM === 'mp-qq') ? 'mp' : 'web';

  const keys = Object.keys(replaceTmpTagMap);
  let res = source;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0 ;i < keys.length;i++) {
    const key = keys[i];
    const value = replaceTmpTagMap[key][type];
    if (!value) {
      continue;
    }
    res = res.replaceAll(key, value);
  }
  return res;
}


