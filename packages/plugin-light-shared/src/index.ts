export * from './core';


export {
  checkBundleAnalyze,
  checkDebugMode,
} from './bundle-analyze';

export {
  PLATFORM_MAP,
  ALL_PLATFORM,
  PLATFORMS_ALL,
  PLATFORMS_MP,
  HTML_MAP,
  CSS_MAP,
  CSS_POSTFIX_MAP,
  CDN_MAP,
} from './config';

export {
  DEFAULT_TRANSPILE_DEPENDENCIES,
  DEFAULT_ADAPTER_DIRS,
  AEGIS_EXTERNAL_SCRIPT_LINK,
  UNI_SIMPLE_ROUTER_SCRIPT_LINK,
  EXTERNAL_LINK_MAP,
} from './config-project';

export {
  ROOT_NAME,
  saveJsonToLog,
  createLogDir,
  normalizePath,
  updateAssetSource,
  removeFirstSlash,
  parseSetDeps,
  getRelativePath,
  getUniCliCache,
} from './helper';


export {
  DEFAULT_CONTEXT_OBJECT,
} from './context';


export {
  getDeps,
} from './deps';


export {
  findDependencies,
} from './find-dependencies';


export {
  checkH5,
} from './h5';


export {
  getLoaderFile,
  getLoaderProdFile,
} from './loader-file';

export {
  saveLoaderLog,
  recordLoaderLog,
} from './loader-log';

export {
  getProjectName,
  getSubProjectName,
} from './project-name';

export {
  updateManifest,
  revertManifest,
} from './replace-manifest';

export {
  getRootDir,
} from './root';


export {
  getSubProjectConfig,
  getSubProjectRoot,
} from './sub-project';
