import { getLoaderFile } from '@plugin-light/shared';

export { innerPublish } from './publish-inner';

export const LOADER = getLoaderFile(__dirname);
export const LOADER_PROD = getLoaderFile(__dirname, true);

