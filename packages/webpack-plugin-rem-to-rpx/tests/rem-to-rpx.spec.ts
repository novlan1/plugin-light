import { handleRem } from '../src/css-handler';

describe('handleRem', () => {
  it('handleRem', () => {
    const res = handleRem('.1rem', 100, 'rpx');
    expect(res).toBe('10rpx');
  });
});
