import  { crossPlatformLoader } from '../src/cross-platform';

const source = 'import List from \'./list-@TIP_PLATFORM_NAME\';\n';
const expectedMp = 'import List from \'./list-mp\';\n';
const expectedH5 = 'import List from \'./list-web\';\n';

describe('crossPlatformLoader', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    process.env = { ...oldEnv };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it('should work correctly (VUE_APP_PLATFORM not set)', () => {
    expect(crossPlatformLoader(source)).toBe(expectedH5);
  });

  it('should work correctly (h5)', () => {
    process.env.VUE_APP_PLATFORM = 'h5';
    expect(crossPlatformLoader(source)).toBe(expectedH5);
  });

  it('should work correctly (mp-weixin)', () => {
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(crossPlatformLoader(source)).toBe(expectedMp);
  });

  it('should work correctly (mp-qq)', () => {
    process.env.VUE_APP_PLATFORM = 'mp-qq';
    expect(crossPlatformLoader(source)).toBe(expectedMp);
  });
});
