import * as fs from 'fs';
import path from 'path';
import { getStyleList, genInjectContent, getComponentName } from '../../src/';


jest.mock('fs');

const dir = path.resolve(process.cwd(), 'src/local-component/ui/tip-match/tip-match-notice/css');
const dirWithoutComponentName = path.resolve(process.cwd(), 'src/local-component/ui/tip-match/tip-match-notice');


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

  it('getStyleList', () => {
    expect(getStyleList(dir)).toEqual(['dialog', 'icon']);
  });

  it('getComponentName', () => {
    expect(getComponentName(dir)).toBe('tip-match-notice');

    const dir2 = path.resolve(process.cwd(), 'src/project/gp/components/dialogs/match-result-dialog/css');
    expect(getComponentName(dir2)).toBe('match-result-dialog');

    expect(getComponentName(dirWithoutComponentName)).toBeFalsy();
  });

  it('genInjectContent', () => {
    expect(genInjectContent({
      styleList: ['dialog', 'icon'],
      componentName: 'tip-match-notice',
      topElement: 'body',
    })).toMatchSnapshot();
  });
});
