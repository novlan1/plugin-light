import insertPageMeta from '../../../loader/insert-page-meta';
import path from 'path';

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


describe('insertPageMeta', () => {
  it('insertPageMeta', () => {
    const source = `
<template>
  <ModuleCustomGroupType
    :game-info-key="gameInfoKey"
  />
</template>
    `;
    process.env.UNI_PLATFORM = 'mp-weixin';
    process.env.VUE_APP_DIR = '';

    expect(insertPageMeta.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, source)).toMatchSnapshot();
  });


  it('already have', () => {
    const source = `
<template>
  <page-meta :root-font-size="mixinRootFontSize + 'px'" page-style="height: 100%;width: 100%;">
    <ModuleCustomGroupType
      :game-info-key="gameInfoKey"
    />
  </page-meta>
</template>
    `;
    process.env.UNI_PLATFORM = 'mp-weixin';
    process.env.VUE_APP_DIR = '';

    expect(insertPageMeta.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, source)).toMatchSnapshot();
  });
});
