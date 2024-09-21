import * as fs from 'fs';
import path from 'path';
import * as loaderUtils from 'loader-utils';
import injectDynamicStyleWeb from '../src/loader';


jest.mock('fs');
jest.mock('loader-utils');

const dir = path.resolve(process.cwd(), 'src/local-component/ui/tip-match/tip-match-notice/css');
const dirWithoutComponentName = path.resolve(process.cwd(), 'src/local-component/ui/tip-match/tip-match-notice');

const source = `.tip-btn-primary{
    color: #212124;
    background-size: 100% 100%;
}`;

describe('injectDynamicStyleWeb', () => {
  const oldEnv = process.env;

  beforeAll(() => {
    jest.spyOn(fs, 'readdirSync').mockReturnValue(['base.scss', 'dialog.scss', 'icon.scss'] as any);
  });

  beforeEach(() => {
    process.env = { ...oldEnv };
    process.env.UNI_PLATFORM = 'h5';
  });

  afterEach(() => {
    process.env = oldEnv;
    jest.restoreAllMocks();
  });

  it('should not be used on non-H5 platform', () => {
    process.env.UNI_PLATFORM = 'mp-weixin';
    expect(injectDynamicStyleWeb.call({ context: dir }, source)).toBe(source);

    process.env.UNI_PLATFORM = 'mp-qq';
    expect(injectDynamicStyleWeb.call({ context: dir }, source)).toBe(source);
  });

  it('should not be used when failed to get the component name', () => {
    expect(injectDynamicStyleWeb.call({ context: dirWithoutComponentName }, source)).toBe(source);
  });

  it('should work correctly', () => {
    expect(injectDynamicStyleWeb.call({ context: dir }, source)).toMatchSnapshot();
  });

  it('should set topElement correctly', () => {
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValue({ topElement: '#container' });
    expect(injectDynamicStyleWeb.call({ context: dir }, source)).toMatchSnapshot();
  });
});
