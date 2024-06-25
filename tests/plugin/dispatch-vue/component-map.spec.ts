import {
  formatComponentPath,
  genIterativeComponentMap,
  flattenUsingComponentMap,
  genMoveComponents,
  replaceAllPolyfill,
} from '../../../src/webpack-plugin/dispatch-vue/helper';

replaceAllPolyfill();

describe('genMoveComponents', () => {
  it('genMoveComponents', () => {
    expect(genMoveComponents({
      component: 'views/index/local-component/ui/pages/user/home/components/guide-simulate/index',
      subPackage: 'views/index',
      outputDir: '/Users/yang/Documents/git-woa/web/dist/build/mp-weixin',
    })).toEqual({
      sourceRef: '/views/index/local-component/ui/pages/user/home/components/guide-simulate/index',
      targetRef: '/views/index/views-index-lcu-pages-user-home-components-guide-simulate/index',
    });
  });
});


describe('formatComponentPath', () => {
  it('formatComponentPath', () => {
    expect(formatComponentPath([
      'index-tip-draggable-default',
      'a',
      'b',
      '/c',
    ], '../../local-component/ui/tip-match/tip-match-rank-award/index'))
      .toEqual({
        a: '/../../local-component/ui/tip-match/tip-match-rank-award/a',
        b: '/../../local-component/ui/tip-match/tip-match-rank-award/b',
        'index-tip-draggable-default': '/../../local-component/ui/tip-match/tip-match-rank-award/index-tip-draggable-default',
        '/c': '/c',
      });
  });


  it('slot', () => {
    expect(formatComponentPath([
      'index-tip-draggable-default',
    ], 'views/match-update/local-component/ui/tip-match/tip-match-rank-award/index')).toEqual({
      'index-tip-draggable-default': '/views/match-update/local-component/ui/tip-match/tip-match-rank-award/index-tip-draggable-default',
    });
  });
});


describe('genIterativeComponentMap', () => {
  it('genIterativeComponentMap', () => {
    const result = {
      a: {
        ABC: {},
        EEE: {},
        Z: {},
      },
      ABC: {
        DDD: {},
      },
      DDD: {
        JJJ: {},
      },
    };
    genIterativeComponentMap(result);

    expect(result).toEqual({
      a: { ABC: { DDD: { JJJ: {} } }, EEE: {}, Z: {} },
      ABC: { DDD: { JJJ: {} } },
      DDD: { JJJ: {} },
    });
  });

  it('circular', () => {
    const page = {
      compAA: { compBB: {} },
      compBB: { compCC: {} },
      compCC: { compAA: {} },
    };

    page.compAA.compBB = page.compBB;
    page.compBB.compCC = page.compCC;
    page.compCC.compAA = page.compAA;

    genIterativeComponentMap(page);

    expect(() => JSON.stringify(page)).toThrow(/Converting circular structure to JSON/);
  });
});


describe('flattenUsingComponentMap', () => {
  it('flattenUsingComponentMap', () => {
    const result = flattenUsingComponentMap({
      a: { ABC: { DDD: { JJJ: {} } }, EEE: {}, Z: {} },
      ABC: { DDD: { JJJ: {} } },
      DDD: { JJJ: {} },
    });

    expect(result).toEqual({
      a: ['ABC', 'EEE', 'Z', 'DDD', 'JJJ'],
      ABC: ['DDD', 'JJJ'],
      DDD: ['JJJ'],
    });
  });

  it('circular-1', () => {
    // 组件C 循环引用了 组件A
    // 间隔 2 级
    const page = { compA: { compB: { compC: {} } } };
    page.compA.compB.compC = page.compA;

    const result = flattenUsingComponentMap(page);

    expect(result).toEqual({
      compA: ['compB'],
    });
  });

  it('circular-2', () => {
    // 组件C 循环引用了 组件B
    // 间隔 1 级

    const page = { compA: { compB: { compC: {} } } };
    page.compA.compB.compC = page.compA.compB;

    const result = flattenUsingComponentMap(page);

    expect(result).toEqual({
      compA: ['compB'],
    });
  });


  it('circular-3', () => {
    // 组件B 循环引用了 组件B
    // 间隔 0 级
    const page = { compA: { compB: { compB: {} } } };
    page.compA.compB.compB = page.compA.compB;

    const result = flattenUsingComponentMap(page);

    expect(result).toEqual({
      compA: ['compB'],
    });
  });

  it('circular-4', () => {
    // 组件C 循环引用了 组件C
    // 相比上例，层次更深
    const page = { compA: { compB: { compC: { compC: {} } } } };
    page.compA.compB.compC.compC = page.compA.compB.compC;

    const result = flattenUsingComponentMap(page);

    expect(result).toEqual({
      compA: ['compB'],
    });
  });

  it('circular-5', () => {
    // 组件A 循环引用了 组件C
    // 组件C 循环引用了 组件A
    const page = {
      compAA: { compBB: {} },
      compBB: { compCC: {} },
      compCC: { compAA: {} },
    };

    page.compAA.compBB = page.compBB;
    page.compBB.compCC = page.compCC;
    page.compCC.compAA = page.compAA;

    const result = flattenUsingComponentMap(page);

    expect(result).toEqual({
      compAA: ['compBB', 'compCC'],
      compBB: ['compCC', 'compAA'],
      compCC: ['compAA', 'compBB'],
    });
  });
});
