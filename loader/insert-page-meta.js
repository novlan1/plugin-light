const path = require('path');
const { getOptions } = require('loader-utils');
const htmlReg = /<template>[\s\n]*<page-meta>([\s\S]+)<\/page-meta>[\s\n]*<\/template>/;
// 需要贪婪匹配
const pureHtmlReg = /(?<=<template>[\s\n]*)([\s\S]+)(?=[\s\n]*<\/template>)/;


function insertPageMeta(source) {
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin') {
    return source;
  }
  const options = getOptions(this) || {};
  const { pages = [] } = options;
  const { resourcePath } = this;
  const rootPath = path.resolve(process.cwd(), './src', process.env.VUE_APP_DIR);

  const fullPages = pages.map(item => `${path.resolve(rootPath, item)}.vue`);
  // console.log('fullPages', fullPages);
  if (!fullPages.includes(resourcePath)) {
    return source;
  }

  if (source.match(htmlReg)) return;

  const res = source.replace(pureHtmlReg, (a, b) => {
    const fontsizeStr = ':root-font-size="mixinRootFontSize + \'px\'" page-style="height: 100%;width: 100%;" ';
    return `<page-meta ${fontsizeStr}>${b}</page-meta>`;
  });
  return res;
}


module.exports = insertPageMeta;

