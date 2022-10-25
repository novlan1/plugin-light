/* eslint-disable @typescript-eslint/no-require-imports */
const { getOptions } = require('loader-utils');

const htmlReg = /(?<=<template>)([\s\S]+)(?=<\/template>)/;
const imgReg = /(<img[\s\S]+?)v-lazy=(?:"|')(.*?)(?:"|')([\s\S]*?>)/g;

const sizeReg = /(?<=[\s\n]+(?:data-)?)size=(?:"|')(\d+)(?:"|')/;
const widthReg = /(?<=[\s\n]+(?:data-)?)width=(?:"|')(\d+)(?:"|')/;
const heightReg = /(?<=[\s\n]+(?:data-)?)height=(?:"|')(\d+)(?:"|')/;


/**
 * 替换vue模板中的v-lazy，比如
 * <img v-lazy="img"> => <img :src="img">
 *
 * 如果提供 options.urlHandler，则用 urlHandler 包裹，比如：
 * <img v-lazy="img"> => <img :src="getCompressUrl(img)">
 *
 * 如果提供 size 和 urlHandler，则向 urlHandler 传递 size 参数，比如：
 * <img v-lazy="img" size="50"> => <img :src="getCompressUrl(img, 50, 50)">
 *
 *
 * 以下几种size都是有效的：
 * <img v-lazy="src" size="50">
 * <img v-lazy="src" data-size="50">
 * <img v-lazy="src" width="50" height="100">
 * <img v-lazy="src" data-width="50" data-height="100">
 */
export default function lazyLoader(source) {
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin' && process.env.VUE_APP_PLATFORM !== 'mp-qq') {
    return source;
  }
  // @ts-ignore
  const options = getOptions(this) || {};
  const { urlHandler } = options;

  let html = '';
  const match = source.match(htmlReg);
  if (match?.[1]) {
    html = match[1];
  }

  if (!html) return source;
  if (!html.match(imgReg)) return source;

  const newHtml = handleImg(html, urlHandler);

  const newSource = source.replace(htmlReg, () => newHtml);
  return newSource;
}

function getSize(pre, post, reg) {
  let size;
  const preMatch = pre.match(reg);
  const postMatch = post.match(reg);
  if (preMatch?.[1]) {
    size = preMatch[1];
  } else if (postMatch?.[1]) {
    size = postMatch[1];
  }
  return size;
}

function getImgSrc({
  urlHandler,
  src,
  size,
  width,
  height,
}) {
  let srcStr = src;
  if (!urlHandler) {
    return src;
  }

  if (width && height) {
    srcStr = `${urlHandler}(${src}, ${width}, ${height})`;
  } else if (size) {
    srcStr = `${urlHandler}(${src}, ${size}, ${size})`;
  } else {
    srcStr = `${urlHandler}(${src})`;
  }
  return srcStr;
}

function handleImg(str = '', urlHandler = '') {
  const res = str.replace(imgReg, (...args) => {
    const { 1: pre, 2: src, 3: post } = args;
    const size = getSize(pre, post, sizeReg);
    const width = getSize(pre, post, widthReg);
    const height = getSize(pre, post, heightReg);

    const srcStr = getImgSrc({
      urlHandler,
      src,
      size,
      width,
      height,
    });
    const innerRes = `${pre} :src="${srcStr}" lazy-load ${post}`;

    return innerRes;
  });
  return res;
}

