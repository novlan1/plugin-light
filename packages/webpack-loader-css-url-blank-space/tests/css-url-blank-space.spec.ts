import { cssUrlBlankSpaceLoader } from '../src/css-url-blank-space';

describe('cssUrlBlankSpaceLoader', () => {
  it('cssUrlBlankSpaceLoader', () => {
    const source = 'format("woff2"),url(https://at.alicdn.com/t/font_2553510_5imfhdc20ag.woff?t=1640074908811)';
    expect(cssUrlBlankSpaceLoader(source)).toBe('format("woff2"), url(https://at.alicdn.com/t/font_2553510_5imfhdc20ag.woff?t=1640074908811)');
  });
});
