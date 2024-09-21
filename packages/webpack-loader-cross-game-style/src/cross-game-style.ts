import { getOptions } from 'loader-utils';
import { ALL_PLATFORM, crossGameStyle, type ICrossGameStyleOptions } from 'plugin-light-shared';
import { shouldUseLoader } from 'plugin-light-shared-vue2';


export function crossGameStyleLoader(this: any, source: string) {
  if (!shouldUseLoader.call(this, [ALL_PLATFORM])) return source;

  // 改为异步loader
  const callback = this.async();
  const options: ICrossGameStyleOptions = getOptions(this);
  const result = crossGameStyle({
    source,
    options,
    dir: this.context,
  });
  callback(null, result);
}

export {
  crossGameStyle,
  ICrossGameStyleOptions,
};
