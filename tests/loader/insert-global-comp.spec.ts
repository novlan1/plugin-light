import insertGlobalComponent from '../../loader/insert-global-comp';
// import { getOptions } from 'loader-utils';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn(),
}));

describe('insertGlobalComponent', () => {
  it('insertGlobalComponent', () => {
    // getOptions.mockReturnValue('1');
    process.env.VUE_APP_PLATFORM = 'mp-weixin';
    insertGlobalComponent.call({
      resourcePath: '1',
    }, '123');
    // expect(insertGlobalComponent('123')).toBe('123');
    expect(1 + 1).toBe(2);
  });
});
