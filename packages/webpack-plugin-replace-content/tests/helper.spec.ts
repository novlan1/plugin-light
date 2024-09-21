import { replaceAllPolyfill } from 't-comm';
import { replaceSource } from '../src/helper';

describe('replaceSource', () => {
  beforeAll(() => {
    replaceAllPolyfill();
  });

  it('should work correctly when matched against string', () => {
    const source = 'console.log("init");';
    const replaceList1 = [
      {
        from: 'console.log("init")',
        to: '',
        files: ['test.js'],
      },
    ];
    const replaceList2 = [
      {
        from: 'console.log("init");',
        to: '// removed',
        files: ['test.js'],
      },
    ];
    expect(replaceSource({ source, replaceList: replaceList1, file: 'test.js' })).toBe(';');
    expect(replaceSource({ source, replaceList: replaceList2, file: 'test.js' })).toBe('// removed');
  });

  it('should work correctly when matched against regex', () => {
    const source = '.card-wrap {\n  background-image: url(https://cdn.dcloud.net.cn/img/test.png);\n}\n';
    const replaceList = [
      {
        from: /background-image:\s?url\(https:\/\/cdn\.dcloud\.net\.cn\/img\/.*?.png\);?/,
        to: '',
        files: ['test.scss'],
      },
      {
        from: /\.[\w-]+ \{\s*\}/g,
        to: '// removed',
        files: ['test.scss'],
      },
    ];
    expect(replaceSource({ source, replaceList, file: 'test.scss' })).toBe('// removed\n');
  });

  it('should work correctly when files are matched against regex', () => {
    const source1 = 'console.log("init");';
    const source2 = 'console.log("(init)");';
    const replaceList = [
      {
        from: /^\s*console\.log\([^)]*\);?\s*$/g,
        to: '// removed',
        files: [/\.(js|ts)x?$/],
      },
      {
        from: /\/\/.*/g,
        to: '',
        files: [/\.(js|ts)$/],
      },
    ];
    expect(replaceSource({ source: source1, replaceList, file: 'test.js' })).toBe('');
    expect(replaceSource({ source: source1, replaceList, file: 'test.tsx' })).toBe('// removed');
    expect(replaceSource({ source: source1, replaceList, file: 'test.txt' })).toBe(source1);
    expect(replaceSource({ source: source2, replaceList, file: 'test.ts' })).toBe(source2);
  });
});
