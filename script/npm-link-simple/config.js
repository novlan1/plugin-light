const ROOT_DIR = '/Users/yang/Documents/git-woa/';

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
    '@tencent/plugin-light',
  ],
  npmRoot: '/Users/yang/Documents/git-woa/tx-uni-plugin-light/lib',
};

module.exports = {
  LINK_CONFIG,
};
