import { replaceAllPolyfill } from 't-comm';
import { getOptions } from 'loader-utils';
import { PLATFORMS_ALL, PLATFORMS_MP } from '@plugin-light/shared';
import { shouldUseLoader } from '@plugin-light/shared-vue2';

import type { IReplaceTemplateTagOptions } from './types';

export function replaceTmpTag(this: any, source: string) {
  replaceAllPolyfill();
  if (!shouldUseLoader.call(this, PLATFORMS_ALL)) return source;

  const options: IReplaceTemplateTagOptions = getOptions(this) || {};

  const { replaceTmpTagMap = {} } = options;

  const type = PLATFORMS_MP.includes((process.env.UNI_PLATFORM || '') as any) ? 'mp' : 'web';

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


