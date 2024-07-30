import { replaceAllPolyfill } from 't-comm';
import { replaceSource } from '../../../src/webpack-plugin/replace-content/helper';

describe('replaceSource', () => {
  beforeAll(() => {
    replaceAllPolyfill();
  });

  it('string match', () => {
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

  it('regex match', () => {
    const source = '.card-wrap {\n  background-image: url(https://cdn.dcloud.net.cn/img/test.png);\n}\n';
    const replaceList = [
      {
        from: /background-image:\s?url\(https:\/\/cdn\.dcloud\.net\.cn\/img\/.*?.png\);?/,
        to: '',
        files: ['test.css'],
      },
      {
        from: /\.[\w-]+ \{\s*\}/g,
        to: '// removed',
        files: ['test.css'],
      },
    ];
    expect(replaceSource({ source, replaceList, file: 'test.css' })).toBe('// removed\n');
  });

  it('regex filename', () => {
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
