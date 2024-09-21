import { traverseDeps } from '../src/traverse-deps';


describe('traverseDeps', () => {
  it('traverseDeps', () => {
    const deps = {
      'src/project/user/main.js': [
        'MAIN',
      ],
      'src/project/user/pages.json': [
        'src/project/user/main.js',
      ],
      'src/project/user/mixins/projectMixins.js': [
        'src/project/user/main.js',
      ],
      'src/project/user/views/battle/battle-detail.vue': [
        'src/project/user/main.js',
        'src/project/user/views/battle/battle-detail.vue',
      ],
      'src/project/user/views/battle-room/captcha-verify.vue': [
        'src/project/user/main.js',
        'src/project/user/views/battle-room/captcha-verify.vue',
      ],
      'src/project/user/views/battle-room/room-searching.vue': [
        'src/project/user/main.js',
        'src/project/user/views/battle-room/room-searching.vue',
      ],
      'src/project/user/store/index.ts': [
        'src/project/user/main.js',
      ],
      'src/project/user/store/modules/user.js': [
        'src/project/user/store/index.ts',
      ],
      'src/local-logic/tip-match/owner-info/index.js': [
        'src/project/user/store/modules/user.js',
      ],
    };
    const result = traverseDeps({
      deps,
      pages: [
        'views/fake-home/index',
        'views/index/index-home',
        'views/battle/battle-detail',
        'views/battle/battle-detail-undetermined',
        'views/battle-room/room',
        'views/battle-room/room-quick',
        'views/battle-room/room-searching',
        'views/battle-room/captcha-verify',
      ],
      mainPath: 'src/project/user/main.js',
    });

    console.log('result', result);
    expect(result).toEqual({
      'src/project/user/main.js': ['MAIN'],
      'src/project/user/pages.json': ['src/project/user/main.js', 'MAIN'],
      'src/project/user/mixins/projectMixins.js': ['src/project/user/main.js', 'MAIN'],
      'src/project/user/views/battle/battle-detail.vue': ['src/project/user/main.js', 'MAIN'],
      'src/project/user/views/battle-room/captcha-verify.vue': ['src/project/user/main.js', 'MAIN'],
      'src/project/user/views/battle-room/room-searching.vue': ['src/project/user/main.js', 'MAIN'],
      'src/project/user/store/index.ts': ['src/project/user/main.js', 'MAIN'],
      'src/project/user/store/modules/user.js': [
        'src/project/user/store/index.ts',
        'src/project/user/main.js',
        'MAIN',
      ],
      'src/local-logic/tip-match/owner-info/index.js': [
        'src/project/user/store/modules/user.js',
        'src/project/user/store/index.ts',
        'src/project/user/main.js',
        'MAIN',
      ],
    });
  });
});
