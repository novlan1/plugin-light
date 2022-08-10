const { getOptions } = require('loader-utils');

const htmlReg = /(?<=<template>)([\s\S]+)(?=<\/template>)/;
const imgReg = /(<img[\s\S]+?)v-lazy=(?:"|')(.*?)(?:"|')([\s\S]*?>)/g;

function lazyLoader(source) {
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



function handleImg(str = '', urlHandler = '') {
  const sizeReg = /size=(?:"|')(\s+)(?:"|')/g;
  const res = str.replace(imgReg, (...args) => {
    // console.log('...args', args);
    const { 1: pre, 2: src, 3: post } = args;
    // const newPre = pre;
    // const newPost = post;
    let size;
    const preMatch = pre.match(sizeReg);
    const postMatch = post.match(sizeReg);
    if (preMatch?.[1]) {
      size = preMatch[1];
    } else if (postMatch?.[1]) {
      size = postMatch[1];
    }

    let srcStr = src;
    if (urlHandler) {
      srcStr = size ? `${urlHandler}(${src}, size, size)` : `${urlHandler}(${src})`;
    }
    const innerRes = `${pre} :src="${srcStr}" lazy-load ${post}`;

    // console.log('innerRes', innerRes);
    return innerRes;
  });
  // console.log('res', res);
  return res;
}

module.exports = lazyLoader;
