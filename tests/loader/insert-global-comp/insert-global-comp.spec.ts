import insertGlobalComponent from '../../../loader/insert-global-comp';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn().mockReturnValue({
    pages: ['MOCK_PAGE'],
    components: [{
      isOnTop: false,
      name: 'MatchCommDialog', // 组件名称
      id: 'tip-match-comm-tips-dialog',
    }],
  }),
}));

describe('insertGlobalComponent', () => {
  it('only one tag', () => {
    const source = `
<template>
  <ModuleCustomGroupType
    :game-info-key="gameInfoKey"
  />
</template>
`;
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(insertGlobalComponent.call({
      resourcePath: 'MOCK_PAGE',
    }, source)).toMatchSnapshot();
  });


  it('first tag is comment', () => {
    const source = `<template>
<!-- 战后数据和直播页面 -->
<div
  class="battle-detail-wrap"
  style="width:100%;height: 100%;"
>
  <page-loading v-if="mShowPageLoading" />
  <BattleDetailModule v-else-if="isScheEnd" />
  <VideoRoomModule v-else />
</div>
</template>`;
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(insertGlobalComponent.call({
      resourcePath: 'MOCK_PAGE',
    }, source)).toMatchSnapshot();
  });


  it('already have 1', () => {
    const source = `<template>
<!-- 战后数据和直播页面 -->
<div
  class="battle-detail-wrap"
  style="width:100%;height: 100%;"
>
  <page-loading v-if="mShowPageLoading" />
  <BattleDetailModule v-else-if="isScheEnd" />
  <VideoRoomModule v-else />
  <MatchCommDialog id="tip-match-comm-tips-dialog" /></template>
</div>
</template>`;
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(insertGlobalComponent.call({
      resourcePath: 'MOCK_PAGE',
    }, source)).toMatchSnapshot();
  });


  it('already have 2', () => {
    const source = `<template>
<!-- 战后数据和直播页面 -->
<div
  class="battle-detail-wrap"
  style="width:100%;height: 100%;"
>
  <page-loading v-if="mShowPageLoading" />
  <BattleDetailModule v-else-if="isScheEnd" />
  <VideoRoomModule v-else />
  <match-comm-dialog id="tip-match-comm-tips-dialog" /></template>
</div>
</template>`;
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(insertGlobalComponent.call({
      resourcePath: 'MOCK_PAGE',
    }, source)).toMatchSnapshot();
  });
});


describe('Other Html Tag', () => {
  it('p', () => {
    const source = `<template>
<p
  class="battle-detail-wrap"
  style="width:100%;height: 100%;"
>
  <page-loading v-if="mShowPageLoading" />
  <BattleDetailModule v-else-if="isScheEnd" />
  <VideoRoomModule v-else />
</p>
</template>`;

    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(insertGlobalComponent.call({
      resourcePath: 'MOCK_PAGE',
    }, source)).toMatchSnapshot();
  });


  it('span', () => {
    const source = `<template>
<span
  class="battle-detail-wrap"
  style="width:100%;height: 100%;"
>
  <a>123</a>
</span>
</template>`;

    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    expect(insertGlobalComponent.call({
      resourcePath: 'MOCK_PAGE',
    }, source)).toMatchSnapshot();
  });
});
