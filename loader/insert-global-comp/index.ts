import { replaceAllPolyfill, hyphenate } from 't-comm';
import { getOptions } from 'loader-utils';
import { getPagePath } from './page-path';


const oneTagReg = /(?<=<template>\s*)(<[^>]+\/?>)(?=\s*<\/template>)/;
const firstCommentReg = /(?<=<template>[\s\n]*(?:<!--.*?-->\s*)<\w+[^>]*>)([\s\S]*)(?=<\/\w+>[\s\n]*<\/template>)/;
const notFirstDivReg = /(?<=<template>\s*)(<(?!\w+)[^>]+>[\s\S]*)(?=\s*<\/template>)/;
const htmlReg = /(?<=<template>[\s\n]*<\w+[^>]*>)([\s\S]*)(?=<\/\w+>[\s\n]*<\/template>)/;


export default function insertGlobalComponent(source) {
  replaceAllPolyfill();

  // @ts-ignore
  const options = getOptions(this) || {};
  const { platforms = ['mp-weixin', 'mp-qq'], components = [] } = options;
  const platform = process.env.VUE_APP_PLATFORM;
  if (!platforms.includes(platform)) {
    return source;
  }

  let { pages } = options;
  if (pages === undefined) {
    pages = getPagePath();
  }

  // @ts-ignore
  const { resourcePath } = this;
  if (!pages.includes(resourcePath)) {
    return source;
  }

  const res = insertComp(source, components);
  return res;
}

function getExtraStr(props, events) {
  let extra = props.reduce((acc, prop) => {
    const { key, value, custom } = prop;
    acc += `${custom ? ':' : ''}${key}="${value}" `;
    return acc;
  }, '');

  extra += events.reduce((acc, e) => {
    const { name, event } = e;
    acc += ` @${name}="${event}" `;
    return acc;
  }, '');

  return extra;
}

function composeCompStr(components, isOnTop) {
  components = components.filter(item => !!item.isOnTop === !!isOnTop);
  let str = '<template>';
  str += components.map((item) => {
    const { name, id, props = [], events = [] } = item;
    const extra = getExtraStr(props, events);

    return `<${name} id="${id}" ${extra}/>`;
  }).join('\n');
  str += '</template>';
  return str;
}

function insertComp(source, components) {
  const newComponents = components.filter((item) => {
    const { name } = item;
    return !isAlreadyInPage(source, name);
  });

  if (!newComponents.length) {
    return source;
  }

  const insertTopStr = composeCompStr(newComponents, true);
  const insertBottomStr = composeCompStr(newComponents, false);

  if (source.match(oneTagReg)) {
    return source.replace(oneTagReg, (a, b) => `<div>${insertTopStr} ${b} ${insertBottomStr}</div>`);
  }

  if (source.match(firstCommentReg)) {
    return source.replace(firstCommentReg, (a, b) => insertTopStr + b + insertBottomStr);
  }

  if (source.match(notFirstDivReg)) {
    return source.replace(notFirstDivReg, (a, b) => `<div>${insertTopStr} ${b} ${insertBottomStr}</div>`);
  }

  const res = source.replace(htmlReg, (a, b) => insertTopStr + b + insertBottomStr);

  return res;
}

function isAlreadyInPage(source, comp) {
  const compReg = new RegExp(`<template>[\\s\\S]*(${comp}|${hyphenate(comp)})([\\s\\S]+)<\\/template>`);
  if (source.match(compReg)) return true;
  return false;
}


