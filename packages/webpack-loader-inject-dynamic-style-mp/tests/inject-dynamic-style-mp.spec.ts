import * as fs from 'fs';
import path from 'path';
import * as LoaderUtils from 'loader-utils';
import injectDynamicStyleMp from '../src/loader';


jest.mock('fs');

const dir = path.resolve(process.cwd(), 'src/local-component/ui/tip-match/tip-match-notice');

const source = '<style lang="scss" src="./css/base.scss"></style>';
const sourceWithoutCSSPath = '<style lang="scss" src="./css/vars.scss"></style>';

describe('injectDynamicStyleMp', () => {
  const oldEnv = process.env;

  beforeAll(() => {
    jest.spyOn(fs, 'readdirSync').mockReturnValue(['base.scss', 'dialog.scss', 'icon.scss'] as any);
  });

  beforeEach(() => {
    process.env = { ...oldEnv };
    process.env.UNI_PLATFORM = 'mp-weixin';
  });

  afterEach(() => {
    process.env = oldEnv;
    jest.restoreAllMocks();
  });

  it('should not be used on non-MP platform', () => {
    process.env.UNI_PLATFORM = 'h5';
    expect(injectDynamicStyleMp.call({ context: dir }, source)).toBe(source);
  });

  it('should not be used when failed to match CSS path', () => {
    expect(injectDynamicStyleMp.call({ context: dir }, sourceWithoutCSSPath)).toBe(sourceWithoutCSSPath);
  });

  it('should work correctly', () => {
    expect(injectDynamicStyleMp.call({ context: dir }, source)).toMatchSnapshot();
  });

  it('should set topElement correctly', () => {
    jest.spyOn(LoaderUtils, 'getOptions').mockReturnValue({ topElement: '#container' });
    expect(injectDynamicStyleMp.call({ context: dir }, source)).toMatchSnapshot();
  });
});
