import { extractUniRoutes } from '../src/helper';

const MOCK_BUNDLE = `
e.__uniRoutes=[{path:"/",alias:"/views/entrance/entrance",component:{render:function(e){return e("Page",{props:Object.assign({isQuit:!0,isEntry:!0},__uniConfig.globalStyle,{navigationStyle:"custom"})},[e("views-entrance-entrance",{slot:"page"})])}},meta:{id:1,name:"views-entrance-entrance",isNVue:!1,maxWidth:1190,pagePath:"views/entrance/entrance",isQuit:!0,isEntry:!0,windowTop:0}},{path:"/views/index/index",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationStyle:"custom"})},[e("views-index-index",{slot:"page"})])}},meta:{name:"views-index-index",isNVue:!1,maxWidth:1190,pagePath:"views/index/index",windowTop:0}},{path:"/views/index/debug",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationBarTitleText:"Debug"})},[e("views-index-debug",{slot:"page"})])}},meta:{name:"views-index-debug",isNVue:!1,maxWidth:1190,pagePath:"views/index/debug",windowTop:44}},{path:"/views/match/single-match-detail",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationBarTitleText:"赛事详情"})},[e("views-match-single-match-detail",{slot:"page"})])}},meta:{name:"views-match-single-match-detail",isNVue:!1,maxWidth:1190,pagePath:"views/match/single-match-detail",windowTop:44}},{path:"/views/match/map",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationBarTitleText:"查看地图"})},[e("views-match-map",{slot:"page"})])}},meta:{name:"views-match-map",isNVue:!1,maxWidth:1190,pagePath:"views/match/map",windowTop:44}},{path:"/views/match-list/match-list",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationBarTitleText:"赛事列表"})},[e("views-match-list-match-list",{slot:"page"})])}},meta:{name:"views-match-list-match-list",isNVue:!1,maxWidth:1190,pagePath:"views/match-list/match-list",windowTop:44}},{path:"/views/match-list/match-group",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationBarTitleText:"比赛分组"})},[e("views-match-list-match-group",{slot:"page"})])}},meta:{name:"views-match-list-match-group",isNVue:!1,maxWidth:1190,pagePath:"views/match-list/match-group",windowTop:44}},{path:"/views/match-rule/match-rule-page",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationBarTitleText:"赛事规则"})},[e("views-match-rule-match-rule-page",{slot:"page"})])}},meta:{name:"views-match-rule-match-rule-page",isNVue:!1,maxWidth:1190,pagePath:"views/match-rule/match-rule-page",windowTop:44}},{path:"/views/match-rule/match-admin-apply",component:{render:function(e){return e("Page",{props:Object.assign({},__uniConfig.globalStyle,{navigationBarTitleText:"赛事管理员申请"})},[e("views-match-rule-match-admin-apply",{slot:"page"})])}},meta:{name:"views-match-rule-match-admin-apply",isNVue:!1,maxWidth:1190,pagePath:"views/match-rule/match-admin-apply"
],
`;

describe('extractUniRoutes', () => {
  it('extractUniRoutes', () => {
    const list = extractUniRoutes(MOCK_BUNDLE);

    expect(list).toMatchObject([
      {
        path: '/',
        name: 'views-entrance-entrance',
        pagePath: 'views/entrance/entrance',
      },
      {
        path: '/views/index/index',
        name: 'views-index-index',
        pagePath: 'views/index/index',
      },
      {
        path: '/views/index/debug',
        name: 'views-index-debug',
        pagePath: 'views/index/debug',
      },
      {
        path: '/views/match/single-match-detail',
        name: 'views-match-single-match-detail',
        pagePath: 'views/match/single-match-detail',
      },
      {
        path: '/views/match/map',
        name: 'views-match-map',
        pagePath: 'views/match/map',
      },
      {
        path: '/views/match-list/match-list',
        name: 'views-match-list-match-list',
        pagePath: 'views/match-list/match-list',
      },
      {
        path: '/views/match-list/match-group',
        name: 'views-match-list-match-group',
        pagePath: 'views/match-list/match-group',
      },
      {
        path: '/views/match-rule/match-rule-page',
        name: 'views-match-rule-match-rule-page',
        pagePath: 'views/match-rule/match-rule-page',
      },
      {
        path: '/views/match-rule/match-admin-apply',
        name: 'views-match-rule-match-admin-apply',
        pagePath: 'views/match-rule/match-admin-apply',
      },
    ]);
  });
});
