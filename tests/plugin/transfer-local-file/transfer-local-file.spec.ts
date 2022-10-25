import { replaceSource } from '../../../plugin/transfer-local-file/core';


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
require('../../common/abc/123.js');(global["webpackJsonp"] =require('../../common/abc/123.js');(global["webpackJsonp"] =
require('../../local-logic/abc/123.js');(global["webpackJsonp"] =require('../../common/abc/123.js');(global["webpackJsonp"] =
require('../../components/abc/123.js');(global["webpackJsonp"] =require('../../common/abc/123.js');(global["webpackJsonp"] =
require('../../component/abc/123.js');(global["webpackJsonp"] =require('../../common/abc/123.js');(global["webpackJsonp"] =
require('../../comm/abc/123.js');(global["webpackJsonp"] =require('../../common/abc/123.js');(global["webpackJsonp"] =
require('../../comm/login/123.js');(global["webpackJsonp"] =require('../../common/abc/123.js');(global["webpackJsonp"] =
`;
    expect(replaceSource(source, adapterDirs)).toMatchSnapshot();
  });
});
