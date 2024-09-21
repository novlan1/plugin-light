import { getMovingComponents } from '../src/core';

import { GLOBAL_COMPONENT_ALL } from './data/global-component-all';
import { USING_COMPONENT_PAGES } from './data/using-component-all-more';
import { SUB_PACKAGES } from './data/sub-packages';
import { RESULT_MOVING_COMPONENT } from './data/result-moving-component';
// import fs from 'fs';


describe('getMovingComponents', () => {
  it('getMovingComponents', () => {
    const result = getMovingComponents({
      usingComponentPages: USING_COMPONENT_PAGES,
      subPackageRoots: Object.keys(SUB_PACKAGES),
      globalCompsValues: GLOBAL_COMPONENT_ALL,
      MOVE_COMPONENT_MIN_DISABLE_LIST: [],
      MOVE_COMPONENT_MIN_USE_TIMES: 10000000,
      outputDir: '/Users/yang/Documents/xxx/web/dist/build/mp-weixin',
    });

    // fs.writeFileSync('test.json', JSON.stringify(result, null, 2), {
    //   encoding: 'utf-8',
    // });
    expect(result).toEqual(RESULT_MOVING_COMPONENT);
  });
});
