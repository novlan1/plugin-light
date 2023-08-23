import * as path from 'path';


const TOOL_PATH_MAP = {
  tipCSSLoader: './loader/cross-game-style.js',
  crossPlatformVueLoader: './loader/cross-platform.js',
  crossPlatformJSLoader: './loader/cross-platform.js',
  ifdefLoader: './loader/ifdef-loader.js',
  publishUtil: './webpack-publish.js',
};


export function getLocalToolPathMap(): Record<string, any> {
  return Object.keys(TOOL_PATH_MAP).reduce((acc, key) => {
    acc[key] = path.resolve(__dirname, TOOL_PATH_MAP[key]);
    return acc;
  }, {});
}
