import { removeUseRemFunction } from '../src/core';

describe('removeUseRemFunction', () => {
  it('removeUseRemFunction', () => {
    expect(removeUseRemFunction('')).toBe('');
    expect(removeUseRemFunction('function useRem(){console.log(123)}')).toBe('function useRem() {}');
  });
});
