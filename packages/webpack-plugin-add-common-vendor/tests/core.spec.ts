/* eslint-disable @typescript-eslint/no-require-imports */
// import { addCommonVendorCore } from '../src/core';


jest.mock('plugin-light-shared', () => {
  const originalModule = jest.requireActual('plugin-light-shared');

  return { ...originalModule, saveJsonToLog(content: any) {
    logOutput = content;
  } };
});

let logOutput: any;

const createMockAsset = (source: string) => ({
  source() {
    return source;
  },
  size() {
    return source.length;
  },
});

const createMockAssets: () => Record<string, any> = () => ({
  'common/vendor.js': createMockAsset('console.log("common/vendor.js")'),
  'views/index/common/vendor.js': createMockAsset('console.log("views/index/common/vendor.js")'),
  'views/index/debug.js': createMockAsset('console.log("debug")'),
  'views/index/index.qss': createMockAsset('.index{margin:auto;}'),
  'views/index/index.js': createMockAsset('console.log("index")'),
  'views/index/index-match.qss': createMockAsset('.index-match{margin:auto;}'),
  'views/index/index-match.js': createMockAsset('console.log("index-match")'),
  'views/index/index-mine.qss': createMockAsset('.index-main{margin:auto;}'),
  'views/index/index-mine.js': createMockAsset('console.log("index-mine")'),
  'views/search/common/vendor.js': createMockAsset('console.log("views/search/common/vendor.js")'),
  'views/search/history.qss': createMockAsset('.history{margin:auto;}'),
  'views/search/history.js': createMockAsset('console.log("history")'),
  'views/search/search.qss': createMockAsset('.search{margin:auto;}'),
  'views/search/search.js': createMockAsset('require(\'../../views/search/common/vendor.js\');console.log("search")'),
  'views/selfhosted/common/vendor.js': createMockAsset('console.log("views/selfhosted/common/vendor.js")'),
  'views/selfhosted/index.qss': createMockAsset('.selfhosted{margin:auto;}'),
  'views/selfhosted/index.js': createMockAsset('require(\'common/vendor.js\');console.log("selfhosted")'),
  'views/setting/common/vendor.js': createMockAsset('console.log("views/setting/common/vendor.js")'),
  'views/setting/setting.qss': createMockAsset('.setting{margin:auto;}'),
  'views/setting/setting.js': createMockAsset('console.log("setting")'),
  'views/web-container/index.qss': createMockAsset('.web-container{margin:auto;}'),
  'views/web-container/index.js': createMockAsset('console.log("web-container")'),
  'views/webview/webview.js': createMockAsset('console.log("webview")'),
  'views/entrance/entrance.json': createMockAsset('{"entrance":{}}'),
  'views/index/index.json': createMockAsset('{"index":{}}'),
  'views/index/debug.json': createMockAsset('{"debug":{}}'),
  'views/selfhosted/index.json': createMockAsset('{"selfhosted":{}}'),
  'views/webview/webview.json': createMockAsset('{"webview":{}}'),
  'views/web-container/index.json': createMockAsset('{"web-container":{}}'),
  'views/search/search.json': createMockAsset('{"search":{}}'),
  'views/search/history.json': createMockAsset('{"history":{}}'),
  'views/manager/manager.json': createMockAsset('{"manager":{}}'),
  'views/setting/setting.json': createMockAsset('{"setting":{}}'),
  'components/global-component/global-component.json': createMockAsset('{"global-component":{}}'),
  'views/index/index-match.json': createMockAsset('{"index-match":{}}'),
  'views/index/index-mine.json': createMockAsset('{"index-mine":{}}'),
});

const originalAssets = createMockAssets();

const pageSet = [
  'views/entrance/entrance',
  'views/index/index',
  'views/index/debug',
  'views/selfhosted/index',
  'views/invite-join/index',
  'views/webview/webview',
  'views/web-container/index',
  'views/search/search',
  'views/search/history',
  'views/setting/setting',
];

const shouldAddCommonVendorToTheseFiles = [
  'views/entrance/entrance.js',
  'views/index/index.js',
  'views/index/debug.js',
  // 'views/selfhosted/index.js',
  'views/setting/setting.js',
];

const subPackages = [
  'views/index',
  'views/match',
  'views/match-list',
  'views/match-rule',
  'views/selfhosted',
  'views/create-vert',
  'views/sche-manage-vert',
  'views/sche-manage-vert-team',
  'views/post-match-detail',
  'views/team',
  'views/streaming',
  'views/invite-join',
  'views/invite-match',
  'views/webview',
  'views/tim-wx',
  'views/test-page',
  'views/battle-room',
  'views/launch-game',
  'views/web-container',
  // 'views/search',
  'views/manager',
  'views/gp-rank',
  'views/setting',
];

const outputDir = '/Users/user/dzs-match/dist/build/mp-qq';


describe('addCommonVendorCore', () => {
  const oldEnv = process.env;
  let assets: Record<string, any>;

  beforeEach(() => {
    process.env = { ...oldEnv };
    assets = createMockAssets();
  });

  afterEach(() => {
    process.env = oldEnv;
    jest.clearAllMocks();
    jest.resetModules();
  });


  it('should work correctly', () => {
    const { addCommonVendorCore } = require('../src/core');

    addCommonVendorCore({ assets, pageSet, subPackages, outputDir });

    expect(logOutput).toMatchSnapshot();

    Object.entries(assets).forEach(([key, value]) => {
      const commonVendor = 'require(\'common/vendor.js\');';
      const originalValue = originalAssets[key].source();

      expect(value.source()).toBe(shouldAddCommonVendorToTheseFiles.includes(key) ? `${commonVendor}${originalValue}` : originalValue);
    });
  });

  it('should execute only once in production', () => {
    process.env.NODE_ENV = 'production';
    // 需要以 require 方式引入，这样 jest.resetModules 才能重置该 module
    const { addCommonVendorCore } = require('../src/core');

    addCommonVendorCore({ assets, pageSet, subPackages, outputDir }); // 首次调用
    addCommonVendorCore({ assets, pageSet, subPackages, outputDir });
    addCommonVendorCore({ assets, pageSet, subPackages, outputDir });

    expect(logOutput).toMatchSnapshot();

    Object.entries(assets).forEach(([key, value]) => {
      const commonVendor = 'require(\'common/vendor.js\');';
      const originalValue = originalAssets[key].source();

      expect(value.source()).toBe(shouldAddCommonVendorToTheseFiles.includes(key) ? `${commonVendor}${originalValue}` : originalValue);
    });
  });
});


describe('insetSpecialContent', () => {
  const oldEnv = process.env;
  let assets: Record<string, any>;

  beforeEach(() => {
    process.env = { ...oldEnv };
    assets = createMockAssets();
  });

  afterEach(() => {
    process.env = oldEnv;
    jest.clearAllMocks();
    jest.resetModules();
  });


  it('should work correctly', () => {
    const { insetSpecialContent } = require('../src/core');

    const fileList = ['views/search/history.js', 'views/search/search.js'];
    const shouldAddCommonVendorToTheseFiles = ['views/search/history.js'];
    const insertCode = 'require(\'../../views/search/common/vendor.js\');';

    insetSpecialContent({ fileList, assets, insertCode });

    expect(logOutput).toMatchSnapshot();

    Object.entries(assets).forEach(([key, value]) => {
      const originalValue = originalAssets[key].source();

      const shouldAddCommonVendor = shouldAddCommonVendorToTheseFiles.includes(key);
      expect(value.source()).toBe(shouldAddCommonVendor ? `${insertCode}${originalValue}` : originalValue);
    });
  });
});
