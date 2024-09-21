// format("woff2"),url(https://at.alicdn.com/t/font_2553510_5imfhdc20ag.woff?t=1640074908811)
// format("woff2"), url(https://at.alicdn.com/t/font_2553510_5imfhdc20ag.woff?t=1640074908811)
String.prototype.replaceAll = function (s1, s2: any) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};

export function cssUrlBlankSpaceLoader(source: string) {
  return source.replaceAll(',url', ', url');
}
