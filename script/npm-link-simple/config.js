const ROOT_DIR = '/Users/yang/Documents/xxx/';

function getTargetDir(dir) {
  return `${ROOT_DIR}${dir}`;
}
const PROJECT_MAP = {
  WEB: 'web',
  DZS_MATCH: 'dzs-match',
};

const LINK_CONFIG = {
  target: getTargetDir(PROJECT_MAP.DZS_MATCH),
  npmList: [
    'plugin-light',
  ],
  npmRoot: '/Users/yang/Documents/xxx/tx-plugin-light/lib',
};

module.exports = {
  LINK_CONFIG,
};
