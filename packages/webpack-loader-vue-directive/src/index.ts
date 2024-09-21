import { getLoaderFile } from '@plugin-light/shared';

export const LOADER = getLoaderFile(__dirname);
export const LOADER_PROD = getLoaderFile(__dirname, true);

export * from './types';

export { replaceDirective } from '@plugin-light/shared';
