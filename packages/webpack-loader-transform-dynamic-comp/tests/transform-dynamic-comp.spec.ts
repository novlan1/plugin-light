import path from 'path';
import transformDynamicComp from '../src/loader';


beforeAll(() => {
  process.env.UNI_PLATFORM = 'mp-weixin';
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
    expect(transformDynamicComp.call(
      { resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue') },
      source,
    )).toMatchSnapshot();
  });
});
