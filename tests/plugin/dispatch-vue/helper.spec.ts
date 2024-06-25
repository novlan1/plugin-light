import {
  findSubPackages,
  replaceAllPolyfill,
  getAllGlobalComps,
  formatReplaceRefList,
} from '../../../src/webpack-plugin/dispatch-vue/helper';

import { ALL_USING_COMPONENT } from './data/using-component-all';
import { GLOBAL_COMPONENT_RAW } from './data/global-component-raw';
import { GLOBAL_COMPONENT_ALL } from './data/global-component-all';
import { USING_COMPONENTS_FLATTEN } from './data/using-component-flatten';

replaceAllPolyfill();


describe('findSubPackages', () => {
  it('findSubPackages', () => {
    expect(findSubPackages(
      ALL_USING_COMPONENT['packages/press-cell/press-cell'],
      ['pages/press'],
    ))
      .toEqual([]);

    expect(findSubPackages(
      ALL_USING_COMPONENT['packages/press-image/press-image'],
      ['pages/press'],
    ))
      .toEqual([
        'pages/press',
      ]);

    expect(findSubPackages(
      ALL_USING_COMPONENT['views/match/local-component/module/tip-match/tip-match-schedule-card-new/index'],
      ['pages/press', 'views/match'],
    ))
      .toEqual([
        'views/match',
      ]);
  });
});

describe('getAllGlobalComps', () => {
  it('getAllGlobalComps', () => {
    const result = getAllGlobalComps({
      globalComps: GLOBAL_COMPONENT_RAW,
      flattenUsingComponent: USING_COMPONENTS_FLATTEN,
    });


    expect(result).toEqual(GLOBAL_COMPONENT_ALL);
  });
});


describe('formatReplaceRefList', () => {
  it('formatReplaceRefList', () => {
    const result = formatReplaceRefList([
      [
        '/local-component/module/tip-match/homepage/index',
        '/views/index/lcm-tm-homepage/index',
        'views/index',
      ],
      [
        '/local-component/module/tip-match/homepage/index',
        '/views/home/lcm-tm-homepage/index',
        'views/home',
      ],
      [
        '/local-component/ui/tip-match/tip-match-popup-join-group/index',
        '/views/index/lcu-tm-tm-popup-join-group/index',
        'views/index',
      ],
      [
        '/local-component/ui/tip-match/tip-match-popup-join-group/index',
        '/views/battle-room/lcu-tm-tm-popup-join-group/index',
        'views/battle-room',
      ],
      [
        '/local-component/ui/tip-match/tip-match-popup-join-group/index',
        '/views/room/lcu-tm-tm-popup-join-group/index',
        'views/room',
      ],
      [
        '/local-component/module/tip-match/tip-match-owner-apply-popup/index',
        '/views/index/lcm-tm-tm-owner-apply-popup/index',
        'views/index',
      ],
      [
        '/local-component/module/tip-match/tip-match-owner-apply-popup/index',
        '/views/match/lcm-tm-tm-owner-apply-popup/index',
        'views/match',
      ],
      [
        '/local-component/module/tip-match/tip-match-owner-apply-popup/index',
        '/views/match-update/lcm-tm-tm-owner-apply-popup/index',
        'views/match-update',
      ],
      [
        '/local-component/module/tip-match/tip-match-owner-apply-popup/index',
        '/views/owner/lcm-tm-tm-owner-apply-popup/index',
        'views/owner',
      ],
      [
        '/local-component/module/tip-match/tip-match-owner-apply-popup/index',
        '/views/home/lcm-tm-tm-owner-apply-popup/index',
        'views/home',
      ],
      [
        '/local-component/ui/tip-match/tip-match-owner-intro-popup/index',
        '/views/index/lcu-tm-tm-owner-intro-popup/index',
        'views/index',
      ],
      [
        '/local-component/ui/tip-match/tip-match-owner-intro-popup/index',
        '/views/match/lcu-tm-tm-owner-intro-popup/index',
        'views/match',
      ],
    ]);

    expect(result).toEqual({
      'views/index': [
        [
          'local-component/module/tip-match/homepage/index',
          'views/index/lcm-tm-homepage/index',
        ],
        [
          'local-component/ui/tip-match/tip-match-popup-join-group/index',
          'views/index/lcu-tm-tm-popup-join-group/index',
        ],
        [
          'local-component/module/tip-match/tip-match-owner-apply-popup/index',
          'views/index/lcm-tm-tm-owner-apply-popup/index',
        ],
        [
          'local-component/ui/tip-match/tip-match-owner-intro-popup/index',
          'views/index/lcu-tm-tm-owner-intro-popup/index',
        ],
      ],
      'views/home': [
        [
          'local-component/module/tip-match/homepage/index',
          'views/home/lcm-tm-homepage/index',
        ],
        [
          'local-component/module/tip-match/tip-match-owner-apply-popup/index',
          'views/home/lcm-tm-tm-owner-apply-popup/index',
        ],
      ],
      'views/battle-room': [
        [
          'local-component/ui/tip-match/tip-match-popup-join-group/index',
          'views/battle-room/lcu-tm-tm-popup-join-group/index',
        ],
      ],
      'views/room': [
        [
          'local-component/ui/tip-match/tip-match-popup-join-group/index',
          'views/room/lcu-tm-tm-popup-join-group/index',
        ],
      ],
      'views/match': [
        [
          'local-component/module/tip-match/tip-match-owner-apply-popup/index',
          'views/match/lcm-tm-tm-owner-apply-popup/index',
        ],
        [
          'local-component/ui/tip-match/tip-match-owner-intro-popup/index',
          'views/match/lcu-tm-tm-owner-intro-popup/index',
        ],
      ],
      'views/match-update': [
        [
          'local-component/module/tip-match/tip-match-owner-apply-popup/index',
          'views/match-update/lcm-tm-tm-owner-apply-popup/index',
        ],
      ],
      'views/owner': [
        [
          'local-component/module/tip-match/tip-match-owner-apply-popup/index',
          'views/owner/lcm-tm-tm-owner-apply-popup/index',
        ],
      ],
    });
  });
});
