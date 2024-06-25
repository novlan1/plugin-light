import { extractComponentDeps } from '../../../src/webpack-plugin/custom-preload/helper';

const MOCK_BUNDLE_STR = `
)),
o.default.component("views-index-debug", (function(e) {
  var t = {
      component: i.e("views-index-debug").then(function() {
          return e(i("57ee"))
      }
      .bind(null, i)).catch(i.oe),
      delay: __uniConfig["async"].delay,
      timeout: __uniConfig["async"].timeout
  };
  return __uniConfig["async"]["loading"] && (t.loading = {
      name: "SystemAsyncLoading",
      render: function(e) {
          return e(__uniConfig["async"]["loading"])
      }
  }),
  __uniConfig["async"]["error"] && (t.error = {
      name: "SystemAsyncError",
      render: function(e) {
          return e(__uniConfig["async"]["error"])
      }
  }),
  t
}
)),
o.default.component("views-index-index", (function(e) {
    var t = {
        component: Promise.all([i.e("default~views-index-index~views-match-list-match-list~views-match-single-match-detail~views-post-mat~b3990181"), i.e("default~views-create-vert-index~views-index-index~views-match-list-match-list~views-match-single-mat~1e765439"), i.e("default~views-battle-room-index~views-index-index~views-match-list-match-list"), i.e("default~views-index-index~views-selfhosted-index"), i.e("views-index-index")]).then(function() {
            return e(i("0e96"))
        }
        .bind(null, i)).catch(i.oe),
        delay: __uniConfig["async"].delay,
        timeout: __uniConfig["async"].timeout
    };
    return __uniConfig["async"]["loading"] && (t.loading = {
        name: "SystemAsyncLoading",
        render: function(e) {
            return e(__uniConfig["async"]["loading"])
        }
    }),
    __uniConfig["async"]["error"] && (t.error = {
        name: "SystemAsyncError",
        render: function(e) {
            return e(__uniConfig["async"]["error"])
        }
    }),
    t
}
)),
n["default"].component("views-webview-webview", (function(e) {
  var n = {
      component: Promise.all([t.e("chunk-0c33caa3"), t.e("chunk-49da847a"), t.e("views-webview-webview")]).then(function() {
          return e(t("7f5a"))
      }
      .bind(null, t)).catch(t.oe),
      delay: __uniConfig["async"].delay,
      timeout: __uniConfig["async"].timeout
  };
  return __uniConfig["async"]["loading"] && (n.loading = {
      name: "SystemAsyncLoading",
      render: function(e) {
          return e(__uniConfig["async"]["loading"])
      }
  }),
  __uniConfig["async"]["error"] && (n.error = {
      name: "SystemAsyncError",
      render: function(e) {
          return e(__uniConfig["async"]["error"])
      }
  }),
  n
}
)),
n["default"].component("views-other-launch-game-launch-game-mp-qq", (function(e) {
    var n = {
        component: t.e("views-other-launch-game-launch-game-mp-qq").then(function() {
            return e(t("0e93"))
        }
        .bind(null, t)).catch(t.oe),
        delay: __uniConfig["async"].delay,
        timeout: __uniConfig["async"].timeout
    };
    return __uniConfig["async"]["loading"] && (n.loading = {
        name: "SystemAsyncLoading",
        render: function(e) {
            return e(__uniConfig["async"]["loading"])
        }
    }),
    __uniConfig["async"]["error"] && (n.error = {
        name: "SystemAsyncError",
        render: function(e) {
            return e(__uniConfig["async"]["error"])
        }
    }),
    n
}
`;


describe('extractComponentDeps', () => {
  it('extractComponentDeps', () => {
    const list = extractComponentDeps(MOCK_BUNDLE_STR);

    expect(list).toMatchObject([
      { name: 'views-index-debug', chunks: ['views-index-debug'] },
      {
        name: 'views-index-index',
        chunks: [
          'default~views-index-index~views-match-list-match-list~views-match-single-match-detail~views-post-mat~b3990181',
          'default~views-create-vert-index~views-index-index~views-match-list-match-list~views-match-single-mat~1e765439',
          'default~views-battle-room-index~views-index-index~views-match-list-match-list',
          'default~views-index-index~views-selfhosted-index',
          'views-index-index',
        ],
      },
      {
        name: 'views-webview-webview',
        chunks: ['chunk-0c33caa3', 'chunk-49da847a', 'views-webview-webview'],
      },
      {
        name: 'views-other-launch-game-launch-game-mp-qq',
        chunks: ['views-other-launch-game-launch-game-mp-qq'],
      },
    ]);
  });
});
