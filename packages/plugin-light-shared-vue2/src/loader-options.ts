import { getOptions } from 'loader-utils';
import { ALL_PLATFORM } from 'plugin-light-shared';


export function shouldUseLoader(this: any, defaultPlatforms: Array<string> = []) {
  const options = getOptions(this) || {};
  const { platforms = defaultPlatforms  } = options;
  const platform = process.env.UNI_PLATFORM || '';

  if (platforms === ALL_PLATFORM
    || (platforms as string[]).indexOf(ALL_PLATFORM) > -1) {
    return true;
  }

  return (platforms  as string[]).includes(platform);
}


