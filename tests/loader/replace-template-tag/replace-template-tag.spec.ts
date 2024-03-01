import replaceTmpTag from '../../../src/webpack-loader/replace-template-tag';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    .mockReturnValue({
      replaceTmpTagMap: {
        REPLACE_TAG_SCROLL_VIEW: {
          web: 'div',
          mp: 'scroll-view',
        },
      },
    }),
}));

beforeAll(() => {
  process.env.UNI_PLATFORM = 'mp-weixin';
});


describe('replaceTmpTag', () => {
  const source = `
<template>
  <!-- 赛程树 -->
  <REPLACE_TAG_SCROLL_VIEW
    v-if="col>=1"
    id="scheduleTreeId"
    ref="scheduleTree"
    scroll-y="true"
    scroll-x="true"
    enable-flex="true"
    enhanced="true"
    :class="['tip-match-pk-schedule-list',
            'tip-match-pk-' + teamTotal,
            isLoserTree && isfirstTree ? 'tip-match-lose-tree':'',
            isLoserTree && !isfirstTree ? 'tip-match-lose-line': ''
    ]"
    :style="{ width: \`\${tabWidth}%\`, transform: \`translate3d(\${scheduleScrollNum}rem,0,0)\` }"
    @touchstart="e=>start(e, 't')"
    @touchmove="move"
    @touchend="end"
    @scroll="onScroll"
  >
    <!-- @mouseup="end" -->
  </REPLACE_TAG_SCROLL_VIEW>
</template>
    `;
  it('replaceTmpTag in mp', () => {
    process.env.UNI_PLATFORM = 'mp-weixin';
    expect(replaceTmpTag(source)).toMatchSnapshot();
  });

  it('replaceTmpTag in web', () => {
    process.env.UNI_PLATFORM = 'h5';
    expect(replaceTmpTag(source)).toMatchSnapshot();
  });
});
