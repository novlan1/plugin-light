import { getLoaderFile } from 'plugin-light-shared';

export const LOADER = getLoaderFile(__dirname);
export const LOADER_PROD = getLoaderFile(__dirname, true);


export { preprocessFile, preprocessFileSync, preprocess } from 'plugin-light-preprocess';
export { type IIfdefOptions } from 'plugin-light-shared';
