import { crossModuleStyle } from '../../../src/webpack-loader/cross-module-style/cross-module-style';


jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    .mockReturnValueOnce({})
    .mockReturnValue({ target: 'dzs-match2' }),
}));

describe('crossModuleStyle', () => {
  it('target not set', () => {
    const source = '<style lang="scss" scoped  src="src/page/@TIP_MODULE_STYLE_NAME/sass/modules/gameMsg.scss"></style>';
    expect(crossModuleStyle(source)).toBe(source);
  });

  it('target set', () => {
    const source = '<style lang="scss" scoped  src="src/page/@TIP_MODULE_STYLE_NAME/sass/modules/gameMsg.scss"></style>';
    expect(crossModuleStyle(source)).toBe('<style lang="scss" scoped  src="src/page/dzs-match2/sass/modules/gameMsg.scss"></style>');
  });

  it('target set but no replace', () => {
    const source = '<style lang="scss" scoped  src="src/page/dzs-match2/sass/modules/gameMsg.scss"></style>';
    expect(crossModuleStyle(source)).toBe(source);
  });
});
