import { getLoaderFile } from 'plugin-light-shared';

export const LOADER = getLoaderFile(__dirname);
export const LOADER_PROD = getLoaderFile(__dirname, true);


export {
  getStyleList,
  genInjectContent,
  BASE_SCSS,
  getComponentName,

  type IInjectDynamicStyleWebOptions,
} from 'plugin-light-shared';
