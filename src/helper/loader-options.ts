import { getOptions } from 'loader-utils';
import { PLATFORM_MAP } from './config';

export function shouldUseLoader(this: any, defaultPlatforms: Array<string> = []) {
  const options = getOptions(this) || {};
  const { platforms = defaultPlatforms  } = options;
  const platform = process.env.UNI_PLATFORM || '';

  return (platforms  as string[]).includes(platform);
}


export const PLATFORMS_MP = [
  PLATFORM_MAP.MP_WX,
  PLATFORM_MAP.MP_QQ,
];

export const PLATFORMS_ALL = [
  PLATFORM_MAP.MP_WX,
  PLATFORM_MAP.MP_QQ,
  PLATFORM_MAP.H5,
];
