import transformDynamicComp from '../../../loader/transform-dynamic-comp';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    .mockReturnValueOnce({
    })
    .mockReturnValue({
      urlHandler: 'getCompressImgUrl',
    }),
}));

beforeAll(() => {
  process.env.VUE_APP_PLATFORM = 'mp-weixin';
});


describe('transformDynamicComp', () => {
  it('transformDynamicComp', () => {
    const source = `
<script>
export default {
  components: {
    xxComp(resolve) {
      require(['xx.comp'], resolve);
    },
  }
}
</script>
    `;
    expect(transformDynamicComp(source)).toMatchSnapshot();
  });
});
