import * as path from 'path';
import { getOptions } from 'loader-utils';
import { shouldUseLoader, PLATFORMS_MP } from '../../helper/loader-options';


const htmlReg = /<template>[\s\n]*<page-meta([\s\S]+)<\/page-meta>[\s\n]*<\/template>/;

// 需要贪婪匹配
const pureHtmlReg = /(?<=<template>[\s\n]*)([\s\S]+)(?=[\s\n]*<\/template>)/;


export default function insertPageMeta(this: any, source) {
  if (!shouldUseLoader.call(this, PLATFORMS_MP)) return source;

  const options = getOptions(this) || {};
  const { pages = [] } = options;

  const { resourcePath } = this;
  const rootPath = path.resolve(process.cwd(), './src', process.env.VUE_APP_DIR || '');

  const fullPages = pages.map(item => `${path.resolve(rootPath, item)}.vue`);
  if (!fullPages.includes(resourcePath)) {
    return source;
  }

  if (source.match(htmlReg)) {
    return source;
  }

  const res = source.replace(pureHtmlReg, (a, b) => {
    const fontsizeStr = ':root-font-size="mixinRootFontSize + \'px\'" page-style="height: 100%;width: 100%;" ';
    return `<page-meta ${fontsizeStr}>${b}</page-meta>`;
  });
  return res;
}

