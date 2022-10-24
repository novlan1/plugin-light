import insertGlobalComponent from '../../loader/insert-global-comp';

describe('insertGlobalComponent', () => {
  it('insertGlobalComponent', () => {
    expect(insertGlobalComponent('123')).toBe('123');
  });
});
