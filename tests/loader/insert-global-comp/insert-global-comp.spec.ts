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
  it('insertGlobalComponent', () => {
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


  it('insertGlobalComponent.2', () => {
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
});
