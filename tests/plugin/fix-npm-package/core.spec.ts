/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-param-reassign */
import { replaceAbsolutePath, findKey } from '../../../plugin/fix-npm-package/core';

describe('replaceAbsolutePath', () => {
  it('replaceAbsolutePath', () => {
    const content = `
//# sourceMappingURL=../../../../Documents/node-modules/@ttt/press-ui/press-icon/press-icon.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    '../../node-modules/@ttt/press-ui/press-icon/press-icon-create-component',
    {
        '../../node-modules/@ttt/press-ui/press-icon/press-icon-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__("/Users/mike/Documents/web/src/node-modules/@ttt/press-ui/press-icon/press-icon"))
        })
    },
    [['../../node-modules/@ttt/press-ui/press-icon/press-icon-create-component']]
]);
    `;
    expect(replaceAbsolutePath({
      source: content,
      path: '/Users/mike/Documents/web',
      key: '89895623',
    })).toMatchSnapshot();
  });
});


describe('findKey', () => {
  it('findKey', () => {
    /** eslint-disable-next-line */
    const obj = { ac8c(t, n, e) {
      'use strict';e.r(n);const a = e('f8da'); const u = e.n(a);for (const r in a)['default'].indexOf(r) < 0 && (function (t) {
        e.d(n, t, (() => a[t]));
      }(r));n.default = u.a;
    }, bae9(t, n, e) {
      'use strict';e.r(n);const a = e('ffce'); const u = e('ac8c');for (const r in u)['default'].indexOf(r) < 0 && (function (t) {
        e.d(n, t, (() => u[t]));
      }(r));e('99b6');let c; const f = e('f0c5'); const i = Object(f.a)(u.default, a.b, a.c, !1, null, '7763f4da', null, !1, a.a, c);n.default = i.exports;
    }, f8da(t, n) {
      'use strict';Object.defineProperty(n, '__esModule', { value: !0 }), n.default = void 0;const a = { props: { loadingBg: { type: String, default: '', required: !1 }, loadingScenes: { type: String, default: 'page', required: !1 } }, options: { virtualHost: !0 }, data() {
        return {};
      }, mounted() {}, methods: {} };n.default = a;
    }, ffce(t, n, e) {
      'use strict';let a;e.d(n, 'b', (() => u)), e.d(n, 'c', (() => r)), e.d(n, 'a', (() => a));var u = function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const t = this; const n = t.$createElement;t._self._c;
      }; var r = [];
    } };
    // eslint-disable-next-line no-eval
    // const obj = eval(str);
    expect(findKey(obj)).toBe('bae9');
  });
});
