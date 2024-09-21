import { replaceSource } from '../src/core';

const adapterDirs = ['comm', 'common'];

describe('replaceSource', () => {
  it('replaceSource', () => {
    expect(replaceSource('../../comm/login/123.js\'', adapterDirs)).toBe('comm/login/123.js\'');
    expect(replaceSource('../../common/login/123.js\'', adapterDirs)).toBe('common/login/123.js\'');
    expect(replaceSource('../../comm/vendor.js\'', adapterDirs)).toBe('comm/vendor.js\'');
  });

  it('white', () => {
    expect(replaceSource('../../common/vendor.js\'', adapterDirs)).toBe('../../common/vendor.js\'');
    expect(replaceSource('../../common/main.js\'', adapterDirs)).toBe('../../common/main.js\'');
    expect(replaceSource('../../common/runtime.js\'', adapterDirs)).toBe('../../common/runtime.js\'');
    expect(replaceSource('../common/runtime.js\'', adapterDirs)).toBe('../common/runtime.js\'');
  });
});
