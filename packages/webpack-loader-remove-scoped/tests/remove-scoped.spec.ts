import removeScoped from '../src/loader';

describe('removeScoped', () => {
  it('should work correctly', () => {
    const source = '<style lang="scss" scoped src="./css/index.scss"></style>';

    expect(removeScoped(source)).toMatchSnapshot();
  });
});
