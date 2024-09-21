import { replaceSource } from '../src/core';

const baseStr = '(global["webpackJsonp"] =require(\'../../common/abc/123.js\');(global["webpackJsonp"] =';

describe('replaceSource', () => {
  const adapterDirs = [
    'comm',
    'common',
    'component',
    'components',
    'logic',
    'local-logic',
    'local-component',
    'login',
    'pages',
    'static',
  ];

  it('replaceSource', () => {
    const source = `
require('../../common/123.js');(global["webpackJsonp"] =require('../../common/123.js');(global["webpackJsonp"] =
require('../../common/vendor.js');(global["webpackJsonp"] =require('../../common/vendor.js');(global["webpackJsonp"] =
require('../../common/abc/123.js');${baseStr}
require('../../local-logic/abc/123.js');${baseStr}
require('../../components/abc/123.js');${baseStr}
require('../../component/abc/123.js');${baseStr}
require('../../comm/abc/123.js');${baseStr}
require('../../comm/login/123.js');${baseStr}
`;
    expect(replaceSource(source, adapterDirs)).toMatchSnapshot();
  });
});
