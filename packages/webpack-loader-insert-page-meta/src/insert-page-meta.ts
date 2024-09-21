import * as path from 'path';
import { getOptions } from 'loader-utils';
import { PLATFORMS_MP } from '@plugin-light/shared';
import { shouldUseLoader } from '@plugin-light/shared-vue2';
import type { IInsertPageMetaOptions } from './types';

const htmlReg = /<template>[\s\n]*<page-meta([\s\S]+)<\/page-meta>[\s\n]*<\/template>/;

// 需要贪婪匹配
const pureHtmlReg = /(?<=<template>[\s\n]*)([\s\S]+)(?=[\s\n]*<\/template>)/;


export function insertPageMeta(this: any, source: string) {
  if (!shouldUseLoader.call(this, PLATFORMS_MP)) return source;

  const options: IInsertPageMetaOptions = getOptions(this) || {};
  const { pages = [] } = options;

  const { resourcePath } = this;
  const rootPath = path.resolve(process.cwd(), './src', process.env.VUE_APP_DIR || '');

  const fullPages = (pages as Array<string>).map(item => `${path.resolve(rootPath, item)}.vue`);
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

