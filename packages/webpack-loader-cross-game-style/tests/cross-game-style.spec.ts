import * as loaderUtils from 'loader-utils';
import { crossGameStyleLoader } from '../src/cross-game-style';


jest.mock('loader-utils');

const source = '<style scoped lang="scss" src="@TIP_STYLE_NAME">\n</style>';

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
    process.env.UNI_PLATFORM = 'h5';
  });

  afterEach(() => {
    process.env = oldEnv;
    jest.restoreAllMocks();
  });

  it('should not be used when platforms don\'t match', async () => {
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValue({ platforms: ['mp-weixin'] as any });

    expect(await callLoader(source)).toBe(source);
  });
});
