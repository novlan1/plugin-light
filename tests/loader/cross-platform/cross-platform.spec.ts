import  { crossPlatformLoader } from '../../../src/webpack-loader/cross-platform/cross-platform';

describe('crossPlatformLoader', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    process.env = { ...oldEnv };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  const source = 'import List from \'./list-@TIP_PLATFORM_NAME\';\n';
  const expectedMp = 'import List from \'./list-mp\';\n';
  const expectedH5 = 'import List from \'./list-web\';\n';

  it('not set', () => {
    expect(crossPlatformLoader(source)).toBe(expectedH5);
  });

  it('mp-weixin', () => {
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(crossPlatformLoader(source)).toBe(expectedMp);
  });

  it('mp-qq', () => {
    process.env.VUE_APP_PLATFORM = 'mp-qq';
    expect(crossPlatformLoader(source)).toBe(expectedMp);
  });

  it('h5', () => {
    process.env.VUE_APP_PLATFORM = 'h5';
    expect(crossPlatformLoader(source)).toBe(expectedH5);
  });
});
