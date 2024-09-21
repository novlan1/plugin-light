import { crossModuleStyle } from '../src/cross-module-style';
import * as loaderUtils from 'loader-utils';


jest.mock('loader-utils');

const source = '<style lang="scss" scoped  src="src/page/@TIP_MODULE_STYLE_NAME/sass/modules/gameMsg.scss"></style>';
const sourceWithoutMatch = '<style lang="scss" scoped  src="src/page/dzs-match2/sass/modules/gameMsg.scss"></style>';

describe('crossModuleStyle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not modify anything if target is not set', () => {
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValue({});

    expect(crossModuleStyle(source)).toBe(source);
  });

  it('should work correctly', () => {
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValue({ target: 'dzs-match2' });

    expect(crossModuleStyle(source)).toBe(sourceWithoutMatch);
  });

  it('should not modify anything if there is no match', () => {
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValue({ target: 'dzs-match2' });

    expect(crossModuleStyle(sourceWithoutMatch)).toBe(sourceWithoutMatch);
  });
});
