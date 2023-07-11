import path from 'path';
import replaceLibrary from '../../../loader/replace-library';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn().mockReturnValue({
    replaceLibraryList: [
      {
        from: 'vant',
        to: 'src/common/tools/fake-library/vant/index.js',
        exact: false,
      },
      {
        from: 'tim-js-sdk',
        to: 'src/common/tools/fake-library/tim-js-sdk/index.js',
        exact: false,
      },
      {
        from: '@ttt/nes-tim',
        to: 'src/common/tools/fake-library/nes-tim/index.js',
        exact: false,
      },
      {
        from: 'swiper',
        to: 'src/common/tools/fake-library/vant/index.js',
        exact: false,
      },
      {
        from: 'lodash-es',
        to: 'src/common/tools/fake-library/vant/index.js',
        exact: false,
      },
    ],
  }),
}));

describe('replaceLibrary', () => {
  it('replaceLibrary', () => {
    const source = `
import nesTim from '@ttt/nes-tim';
import { Swipe, SwipeItem, Tab, Tabs } from 'vant';
import TIM from 'tim-js-sdk';
import '@ttt/nes-tim/lib/nes-tim.css';
import Swiper2, { Navigation, Pagination } from 'swiper';
import get from 'lodash-es/get';
import { post } from 'lodash-es';
    `;
    process.env.UNI_PLATFORM = 'mp-weixin';
    expect(replaceLibrary.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, source)).toMatchSnapshot();
  });
});
