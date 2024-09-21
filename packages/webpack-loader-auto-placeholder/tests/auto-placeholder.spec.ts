import path from 'path';
import { autoPlaceLoader } from '../src/auto-placeholder';


const resourcePath = path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue');
const source = `
export default {
  components: {
    Popup(resolve) {
      require(['src/components/popup'], resolve);
    },
    Dialog(resolve) {
      require(['./components/dialog.vue'], resolve);
    },
    List(resolve) {
      require(['../local-components/list'], resolve);
    },
    Item(resolve) {
      require(['../../local-components/item.vue'], resolve);
    },
  },
  props: {},
  data() {
    return {}
  },
  methods: {},
}`;
const sourceWithEmptyComponents = `
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  methods: {},
}`;

describe('autoPlaceLoader', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    process.env = { ...oldEnv };
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
  });

  afterEach(() => {
    process.env = oldEnv;
    global.placeholderMap = new Map();
  });

  it('should not be used on non-mp platform', () => {
    process.env.VUE_APP_PLATFORM = 'h5';
    const result = autoPlaceLoader.call({ resourcePath }, source);
    expect(global.placeholderMap?.get(resourcePath.replace('.vue', '')) ?? []).toEqual([]);
    expect(result).toBe(source);
  });

  it('should work correctly', () => {
    const result = autoPlaceLoader.call({ resourcePath }, source);
    expect(global.placeholderMap?.get(resourcePath.replace('.vue', '')) ?? []).toMatchSnapshot();
    expect(result).toBe(source);
  });

  it('should work correctly when there are no components', () => {
    const result = autoPlaceLoader.call({ resourcePath }, sourceWithEmptyComponents);
    expect(global.placeholderMap?.get(resourcePath.replace('.vue', '')) ?? []).toEqual([]);
    expect(result).toBe(sourceWithEmptyComponents);
  });
});
