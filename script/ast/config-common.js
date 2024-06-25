
const TARGET_DIR_MAP = {
  WEB: 'web/src/?(project|local-*|live-component-pro|pages)',
  INGAME_PAGE: 'ingame-page/src/?(project|template|component)',
  WG: 'wg/src/?(project)',
  HP_MATCH: 'hp-match/src/?(project|page|local-*)',
  DZS_MATCH: 'dzs-match/src/?(project|page|local-*)',
  CONVERT_CROSS: 'convert-cross/src/?(project|page|local-*)',
  CONVERT: 'convert/src/?(project|page|local-*)',
  PMD_NPM: 'pmd-npm/?(packages)/**/src',
  COMMON: 'common/?(network|login|pag|publish|storage|tools)',
  MATCH_IGAME_ADMIN: 'match-igame-admin/src/?(project)',
  COMPONENT: 'component/?(module|logic|page|tools)',
  IGAME_ADMIN: '',
  IGAME_ADMIN_MERCHANT: '1.merchant/igame-admin/src/?(project|pages)',

  NET_BAR_ACT: 'activities/src/project',

  SLONE_WEB: '/Users/yang/Documents/git-woa/2.slone/web/src/?(project|page|local-*)',


  MATCH_OA_ADMIN: 'match-oa-admin/src/project',
};


const REPLACE_TARGET_DIR = TARGET_DIR_MAP.MATCH_OA_ADMIN;


const ROOT_DIR = '/Users/yang/Documents/git-woa/';
function getReplaceTargetDir() {
  if (REPLACE_TARGET_DIR.startsWith('/')) {
    return REPLACE_TARGET_DIR;
  }
  return `${ROOT_DIR}${REPLACE_TARGET_DIR}`;
}


module.exports = {
  getReplaceTargetDir,
};
