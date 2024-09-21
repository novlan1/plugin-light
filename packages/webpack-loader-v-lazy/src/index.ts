import { getLoaderFile } from 'plugin-light-shared';

export const LOADER = getLoaderFile(__dirname);
export const LOADER_PROD = getLoaderFile(__dirname, true);


export { vLazyCore, type IVLazyOptions } from 'plugin-light-shared';