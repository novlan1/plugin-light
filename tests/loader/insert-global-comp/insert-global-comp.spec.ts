/* eslint-disable jest/expect-expect */
import insertGlobalComponent from '../../../src/webpack-loader/insert-global-comp';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn().mockReturnValue({
    pages: ['MOCK_PAGE'],
    components: [
      {
        isOnTop: false,
        name: 'MatchCommDialog', // 组件名称
        id: 'tip-match-comm-tips-dialog',
      },
      {
        isOnTop: false,
        name: 'GlobalComponent',
        id: 'global-component',
      },
      {
        isOnTop: false,
        name: 'PressGpDialog',
        id: 'press-gp-dialog',
      },
    ],
  }),
}));

const baseStr = `<page-loading v-if="mShowPageLoading" />
  <BattleDetailModule v-else-if="isScheEnd" />
  <VideoRoomModule v-else />`;

const firstTagProps = `class="battle-detail-wrap"
  style="width:100%;height: 100%;"`;


function expectFunction(source: string) {
  process.env.UNI_PLATFORM = 'mp-weixin';
  expect(insertGlobalComponent.call({
    resourcePath: 'MOCK_PAGE',
  }, source)).toMatchSnapshot();
}

describe('insertGlobalComponent', () => {
  it('only one tag', () => {
    const source = `
<template>
  <ModuleCustomGroupType
    :game-info-key="gameInfoKey"
  />
</template>
`;
    expectFunction(source);
  });


  it('first tag is comment', () => {
    const source = `<template>
<!-- 战后数据和直播页面 -->
<div
  ${firstTagProps}
>
  ${baseStr}
</div>
</template>`;
    expectFunction(source);
  });


  it('already have 1', () => {
    const source = `<template>
<!-- 战后数据和直播页面 -->
<div
  ${firstTagProps}
>
  ${baseStr}
  <MatchCommDialog id="tip-match-comm-tips-dialog" /></template>
</div>
</template>`;
    expectFunction(source);
  });


  it('already have 2', () => {
    const source = `<template>
<!-- 战后数据和直播页面 -->
<div
  ${firstTagProps}
>
  ${baseStr}
  <match-comm-dialog id="tip-match-comm-tips-dialog" /></template>
</div>
</template>`;
    expectFunction(source);
  });
});


describe('Other Html Tag', () => {
  it('p', () => {
    const source = `<template>
<p
  ${firstTagProps}
>
${baseStr}
</p>
</template>`;

    expectFunction(source);
  });


  it('span', () => {
    const source = `<template>
<span
  ${firstTagProps}
>
  <a>123</a>
</span>
</template>`;

    expectFunction(source);
  });
});
