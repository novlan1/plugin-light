import { paresPreloadOptions } from '../src/helper';

const MOCK_UNI_ROUTES = [
  {
    path: '/',
    name: 'views-index-index',
    pagePath: 'views/index/index',
  },
  {
    path: '/home',
    name: 'views-index-index',
    pagePath: 'views/index/index',
  },
  {
    path: '/views/index/debug',
    name: 'views-index-debug',
    pagePath: 'views/index/debug',
  },
  {
    path: '/single-match-detail',
    name: 'views-match-single-match-detail',
    pagePath: 'views/match/single-match-detail',
  },
  {
    path: '/views/match/map',
    name: 'views-match-map',
    pagePath: 'views/match/map',
  },
  {
    path: '/match-list',
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
];
describe('paresPreloadOptions', () => {
  it('base', () => {
    const result = paresPreloadOptions([{
      condition: {
        path: ['/home'],
      },
      pages: ['views-index-index'],
    }], MOCK_UNI_ROUTES);
    const expectResult = [
      {
        condition: {
          path: [
            '/home',
          ],
        },
        pages: [
          {
            page: [
              'views-index-index',
            ],
            delay: 0,
          },
        ],
      },
    ];

    console.log('result', JSON.stringify(result, null, 2));
    expect(result).toMatchObject(expectResult);

    expect(paresPreloadOptions([{
      condition: {
        path: ['/home'],
      },
    },
    ], MOCK_UNI_ROUTES)).toMatchObject(expectResult);
  });

  it('more', () => {
    expect(paresPreloadOptions([
      {
        condition: {
          path: ['/home'],
        },
      },
      {
        condition: {
          path: ['/match-list'],
        },
      },
      {
        condition: {
          path: ['/single-match-detail'],
        },
      },
    ], MOCK_UNI_ROUTES)).toMatchObject([
      {
        condition: {
          path: ['/home'],
        },
        pages: [{
          page: ['views-index-index'],
          delay: 0,
        }],
      },
      {
        condition: {
          path: ['/match-list'],
        },
        pages: [{
          page: ['views-match-list-match-list'],
          delay: 0,
        }],
      },
      {
        condition: {
          path: ['/single-match-detail'],
        },
        pages: [{
          page: ['views-match-single-match-detail'],
          delay: 0,
        }],
      },
    ]);
  });
});
