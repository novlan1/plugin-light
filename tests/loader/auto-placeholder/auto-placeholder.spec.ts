import path from 'path';
import { autoPlaceLoader } from '../../../src/webpack-loader/auto-placeholder/auto-placeholder';


const resourcePath = path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue');

describe('autoPlaceLoader', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    process.env = { ...oldEnv };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it('not in mp-weixin or mp-qq', () => {
    const source = `
export default {
  components: {
    Card(resolve) {
      require(['./components/card'], resolve);
    },
  },
  props: {},
  data() {
    return {}
  },
  methods: {},
}`;
    const result = autoPlaceLoader.call({ resourcePath }, source);
    expect(global.placeholderMap?.get(resourcePath.replace('.vue', '')) ?? []).toEqual([]);
    expect(result).toBe(source);
  });

  it('empty components', () => {
    process.env.VUE_APP_PLATFORM = 'mp-qq';
    const source = `
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  methods: {},
}`;
    const result =  autoPlaceLoader.call({ resourcePath }, source);
    expect(global.placeholderMap?.get(resourcePath.replace('.vue', '')) ?? []).toEqual([]);
    expect(result).toBe(source);
  });

  it('with components', () => {
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
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
    const result =  autoPlaceLoader.call({ resourcePath }, source);
    expect(global.placeholderMap?.get(resourcePath.replace('.vue', '')) ?? []).toMatchSnapshot();
    expect(result).toBe(source);
  });
});
