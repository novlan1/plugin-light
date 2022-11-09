import { replaceAbsolutePath } from '../../../plugin/fix-npm-package/core';

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
