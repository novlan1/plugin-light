import path from 'path';
import { fixImportPath } from '../src/core';


const assets = {
  'common/vendor.js': {},
  'views/index/common/vendor.js': {},
  'views/index/index.js': {},
  'views/setting/common/vendor.js': {},
  'views/setting/setting.js': {},
};

const outputDir = '/Users/user/dzs-match/dist/build/mp-weixin';

const defaultHandleList = [
  'common/vendor.js',
  'common/runtime.js',
  'common/main.js',
];


describe('fixImportPath', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    process.env = { ...oldEnv };
  });

  afterEach(() => {
    process.env = oldEnv;
    jest.clearAllMocks();
  });


  it('should work correctly', () => {
    const source = 'require(\'../common/vendor.js\');';
    const filePath = path.resolve(outputDir, 'views/setting/setting.js');

    const { newSource, logData = [] } = fixImportPath({
      source, filePath, root: outputDir, assets,
      handleList: defaultHandleList,
    });

    expect(newSource).toBe('require(\'../../common/vendor.js\');');
    expect(logData).toMatchSnapshot();
  });

  it('should not modify anything if there is no match', () => {
    const source = 'require(\'../../views/search/common/vendor.js\');';
    const filePath = path.resolve(outputDir, 'views/setting/setting.js');

    const { newSource, logData = [] } = fixImportPath({
      source, filePath, root: outputDir, assets,
      handleList: defaultHandleList,
    });

    expect(newSource).toBe(source);
    expect(logData).toHaveLength(0);
  });

  it('should work correctly if there are multiple matches', () => {
    const source = 'require(\'./common/vendor.js\');require(\'../common/vendor.js\');';
    const filePath = path.resolve(outputDir, 'views/setting/setting.js');

    const { newSource, logData = [] } = fixImportPath({
      source, filePath, root: outputDir, assets,
      handleList: defaultHandleList,
    });

    expect(newSource).toBe('require(\'./common/vendor.js\');require(\'../../common/vendor.js\');');
    expect(logData).toMatchSnapshot();
  });
});
