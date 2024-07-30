import * as fs from 'fs';
import { crossGameStyleLoader } from '../../../src/webpack-loader/cross-game-style/cross-game-style';


jest.mock('fs');
jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    .mockReturnValueOnce({ platforms: ['mp-weixin'] })
    .mockReturnValueOnce({ styleName: ['gp', 'pvp'], platforms: ['ALL'] })
    .mockReturnValueOnce({ styleName: ['gp', 'pvp'], platforms: ['ALL'] })
    .mockReturnValue({ platforms: ['ALL'] }),
}));
jest.mock('../../../src/webpack-loader/cross-game-style/style-name', () => ({
  getStyleName: jest.fn()
    .mockReturnValueOnce(['gp', 'pvp'])
    .mockReturnValueOnce(['gp', 'pvp'])
    .mockReturnValue('gp'),
}));

async function callLoader(source: string, context = '') {
  let res: string | Buffer | undefined;
  res = crossGameStyleLoader.call({
    async: () => (
      err: Error | undefined | null,
      source?: string | Buffer,
    ) => process.nextTick(() => res = source),
    context,
  }, source);
  await new Promise(process.nextTick);
  return res;
}

describe('crossGameStyleLoader', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    process.env = { ...oldEnv };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it('loader not used', async () => {
    const source = '<style scoped lang="scss" src="@TIP_STYLE_NAME">\n</style>';
    expect(await callLoader(source)).toBe(source);
  });

  it('styleName is an array', async () => {
    jest.mocked(fs.existsSync).mockReturnValue(true);
    const source = '<style scoped lang="scss" src="@TIP_STYLE_NAME">\n</style>';
    expect(await callLoader(source)).toMatchSnapshot();
  });

  it('get styleName array from options', async () => {
    jest.mocked(fs.existsSync)
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    const source = '<style scoped lang="scss" src="@TIP_STYLE_NAME">\n</style>';
    expect(await callLoader(source)).toMatchSnapshot();
  });

  it('loader used but without match', async () => {
    const source = '<style scoped lang="scss" src="./css/gp.scss">\n</style>';
    expect(await callLoader(source)).toBe(source);
  });

  it('inexistent file', async () => {
    jest.mocked(fs.existsSync).mockReturnValue(false);
    const source = '<style scoped lang="scss" src="@TIP_STYLE_NAME">\n</style>';
    expect(await callLoader(source)).toMatchSnapshot();
  });

  it('file exists', async () => {
    jest.mocked(fs.existsSync).mockReturnValue(true);
    const source = '<style scoped lang="scss" src="@TIP_STYLE_NAME">\n</style>';
    expect(await callLoader(source)).toMatchSnapshot();
  });

  it('get styleName from options', async () => {
    jest.mocked(fs.existsSync).mockReturnValue(true);
    const source = '<style scoped lang="scss" src="@TIP_STYLE_NAME">\n</style>';
    expect(await callLoader(source)).toMatchSnapshot();
  });
});
