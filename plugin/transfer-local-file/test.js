const { replaceSource } = require('./core');

const a = 'require(\'../../common/123.js\');(global["webpackJsonp"] =require(\'../../common/123.js\');(global["webpackJsonp"] =';
const b = 'require(\'../../common/vendor.js\');(global["webpackJsonp"] =require(\'../../common/vendor.js\');(global["webpackJsonp"] =';
const c = 'require(\'../../common/abc/123.js\');(global["webpackJsonp"] =require(\'../../common/abc/123.js\');(global["webpackJsonp"] =';

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

console.log(replaceSource(a, adapterDirs));
console.log(replaceSource(b, adapterDirs));
console.log(replaceSource(c, adapterDirs));
