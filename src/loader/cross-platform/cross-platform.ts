String.prototype.replaceAll = function (s1: any, s2: any) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};

export function crossPlatformLoader(source: string) {
  if (source.indexOf('@TIP_PLATFORM_NAME') !== -1) {
    const platformName = process.env.VUE_APP_PLATFORM && process.env.VUE_APP_PLATFORM.indexOf('mp') > -1 ? 'mp' : 'web';
    return source.replaceAll('@TIP_PLATFORM_NAME', platformName);
  }
  return source;
}

