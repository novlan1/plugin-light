import { handleRem } from '../../../src/webpack-plugin/rem-to-rpx/css-handler';

describe('handleRem', () => {
  it('handleRem', () => {
    const res = handleRem('.1rem', 100, 'rpx');
    expect(res).toBe('10rpx');
  });
});
