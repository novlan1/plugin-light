import { getWebpackBaseConfig } from './base-config';


export const WEBPACK_BASE_CONFIG = {
  ...getWebpackBaseConfig(),
};
export { getWebpackBaseConfig };
export { innerPublish } from './publish-inner';
