import replaceContent from '../src/loader';
import { replaceAllPolyfill } from 't-comm';
import * as loaderUtils from 'loader-utils';


describe('replaceContent', () => {
  beforeAll(() => {
    replaceAllPolyfill();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValueOnce({ replaceList: replaceList1 as any })
      .mockReturnValueOnce({ replaceList: replaceList2 as any });

    expect(replaceContent.call({ resourcePath: 'test.js' }, source)).toBe(';');
    expect(replaceContent.call({ resourcePath: 'test.js' }, source)).toBe('// removed');
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
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValue({ replaceList: replaceList as any });

    expect(replaceContent.call({ resourcePath: 'test.scss' }, source)).toBe('// removed\n');
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
    jest.spyOn(loaderUtils, 'getOptions').mockReturnValue({ replaceList: replaceList as any });

    expect(replaceContent.call({ resourcePath: 'test.js' }, source1)).toBe('');
    expect(replaceContent.call({ resourcePath: 'test.tsx' }, source1)).toBe('// removed');
    expect(replaceContent.call({ resourcePath: 'test.txt' }, source1)).toBe(source1);
    expect(replaceContent.call({ resourcePath: 'test.ts' }, source2)).toBe(source2);
  });
});
