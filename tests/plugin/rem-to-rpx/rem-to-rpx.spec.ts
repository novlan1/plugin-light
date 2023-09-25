import { handleRem } from '../../../src/plugin/rem-to-rpx/css-handler';

describe('handleRem', () => {
  it('handleRem', () => {
    const res = handleRem('.1rem', 100, 'rpx');
    expect(res).toBe('10.00rpx');
  });
});
