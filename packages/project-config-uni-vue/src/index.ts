export { getUniVueConfig } from './uni-vue-config';

// (function () {
//   let isInGame = false;
//   const redirectConfig = [
//     {
//       reg: /\/match-list\/(\d+)/,
//       link: 'match-list',
//       keyList: ['siteId'],
//     },
//     {
//       reg: /\/single-match-detail\/(\d+)\/(\d+)\/(\d+)/,
//       link: 'single-match-detail',
//       keyList: ['siteId', 'parentId', 'childId'],
//     },
//     {
//       reg: /\/invite-join\/(\d+)\/(\d+)\/(\d+)/,
//       link: 'invite-join',
//       keyList: ['siteId', 'parentId', 'childId'],
//     },
//     {
//       reg: /\/invite-match\/(\d+)\/(\d+)\/(\d+)/,
//       link: 'invite-match',
//       keyList: ['siteId', 'parentId', 'childId'],
//     },
//     {
//       reg: /\/match-rule\/(\d+)/,
//       link: 'match-rule',
//       keyList: ['siteId'],
//     },
//     {
//       reg: /\/live\/(\d+)\/([\d_]+)/,
//       link: 'live',
//       keyList: ['childId', 'battleId'],
//     },
//     {
//       reg: /selfhosted/,
//       link: 'selfhosted',
//       keyList: [],
//     },
//     {
//       reg: /\/sche-manage-vert\/(\d+)\/(\d+)\/(\d+)/,
//       link: 'sche-manage-vert',
//       keyList: ['siteId', 'parentId', 'childId'],
//     },
//     {
//       reg: /\/match-group\/(\d+)\/(\d+)\/(\d+)/,
//       link: 'match-group',
//       keyList: ['childId', 'roundId', 'totalRoundNum'],
//     },
//     {
//       reg: /post-match-detail/,
//       link: 'post-match-detail',
//       keyList: [],
//     },
//   ];
//   const newUrlPrefix = 'https://h5.igame.qq.com/pmd-mobile.match.dzs-match.gp/';
//   const newUrlTestPrefix = 'https://h5-test.igame.qq.com/pmd-mobile.match.dzs-match.gp/';
//   const newHorUlrPrefix = 'https://h5.igame.qq.com/pmd-mobile.match.dzs-match.gp-hor/';

//   function getUA() {
//     let useragent = '';
//     // @ts-ignore
//     // eslint-disable-next-line camelcase
//     if (typeof node_userAgent !== 'undefined') {
//       // @ts-ignore
//       // eslint-disable-next-line no-undef,camelcase
//       useragent = node_userAgent;
//     } else if (typeof window !== 'undefined' && window.navigator.userAgent) {
//       useragent = window.navigator.userAgent;
//     }
//     return useragent.toLowerCase();
//   }

//   function checkIsIngame() {
//     const ua = getUA();
//     const isMsdk = ua.indexOf(' msdk/') !== -1; // msdk
//     const isSlugSdk = ua.indexOf('ingame') !== -1; // 微社区sdk

//     return isMsdk || isSlugSdk; // 是否游戏内
//   }


//   function replaceUA() {
//     const ua = getUA();

//     try {
//       const urlCheck = location.href.indexOf('appid=wxc4c0253df149f02d') > -1
//         && location.href.indexOf('msdkEncodeParam') > -1
//         && location.href.indexOf('gameid=wxc4c0253df149f02') > -1;
//       if (!urlCheck) {
//         return;
//       }
//       isInGame = true;

//       // @ts-ignore
//       navigator.__defineGetter__('userAgent', () => {
//         const value = `${ua} MSDK/ `;
//         return value;
//       });
//     } catch (err) { }
//   }


//   function redirectHref() {
//     const currentPathname = '/pmd-mobile.match.dzs-match.gp/';
//     const { pathname, hash, href } = window.location;
//     if (checkIsIngame() || isInGame) {
//       goIngameNewPath(hash);
//       return;
//     }

//     if (pathname === currentPathname) {
//       return;
//     }
//     if (hash.indexOf('noRedirectGp=1') > -1) {
//       return;
//     }
//     if (hash.indexOf('/match-admin-apply/') > -1) {
//       return;
//     }
//     if (hash.indexOf('/match-ob-register/') > -1) {
//       return;
//     }

//     const newHref = getNewPathname(hash, href);
//     if (newHref) {
//       console.log('[replace]', newHref);
//       window.location.replace(newHref);
//     }
//   }

//   function goIngameNewPath(hash: string) {
//     const newHref = `${newHorUlrPrefix}${hash}`;
//     window.location.replace(newHref);
//   }

//   // @ts-ignore
//   function getNewPathname(hash, href) {
//     let newPathName = 'home';
//     let queryStr = '';
//     const queryIndex = href.indexOf('?');
//     if (queryIndex > -1) {
//       queryStr = href.slice(queryIndex + 1);
//       newPathName = `${newPathName}?${queryStr}`;
//     }

//     for (const item of redirectConfig) {
//       const { reg, link, keyList = [] } = item;
//       const match = hash.match(reg);
//       // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
//       if (match && match[0]) {
//         if (match.length !== keyList.length + 1) {
//           continue;
//         }
//         newPathName = `${link}?${keyList.map((key, index) => `${key}=${match[index + 1]}`)
//           .join('&')}${queryStr ? `&${queryStr}` : ''}`;
//         break;
//       }
//     }
//     if (location.href.indexOf('test.igame.qq.com') > -1) {
//       return newUrlTestPrefix + newPathName;
//     }
//     return newUrlPrefix + newPathName;
//   }

//   replaceUA();
//   redirectHref();
// }());


