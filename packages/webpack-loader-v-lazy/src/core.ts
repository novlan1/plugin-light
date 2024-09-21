// import type { IVLazyOptions } from './types';


// const htmlReg = /(?<=<template>)([\s\S]+)(?=<\/template>)/;
// const imgReg = /(<img[\s\S]+?)v-lazy=(?:"|')(.*?)(?:"|')([\s\S]*?>)/g;

// const sizeReg = /(?<=[\s\n]+(?:data-)?)size=(?:"|')(\d+)(?:"|')/;
// const widthReg = /(?<=[\s\n]+(?:data-)?)width=(?:"|')(\d+)(?:"|')/;
// const heightReg = /(?<=[\s\n]+(?:data-)?)height=(?:"|')(\d+)(?:"|')/;


// export function vLazyCore(source: string, options?: IVLazyOptions) {
//   const { urlHandler } = options || {};

//   let html = '';
//   const match = source.match(htmlReg);
//   if (match?.[1]) {
//     html = match[1];
//   }

//   if (!html) return source;
//   if (!html.match(imgReg)) return source;

//   const newHtml = handleImg(html, urlHandler as string);

//   const newSource = source.replace(htmlReg, () => newHtml);
//   return newSource;
// }

// function getSize(pre: string, post: string, reg: RegExp) {
//   let size = '';
//   const preMatch = pre.match(reg);
//   const postMatch = post.match(reg);
//   if (preMatch?.[1]) {
//     size = preMatch[1];
//   } else if (postMatch?.[1]) {
//     size = postMatch[1];
//   }
//   return size;
// }

// function getImgSrc({
//   urlHandler,
//   src,
//   size,
//   width,
//   height,
// }: {
//   urlHandler?: string;
//   src: string;
//   size: string | number;
//   width: string | number;
//   height: string | number;
// }) {
//   let srcStr = src;
//   if (!urlHandler) {
//     return src;
//   }

//   if (width && height) {
//     srcStr = `${urlHandler}(${src}, ${width}, ${height})`;
//   } else if (size) {
//     srcStr = `${urlHandler}(${src}, ${size}, ${size})`;
//   } else {
//     srcStr = `${urlHandler}(${src})`;
//   }
//   return srcStr;
// }

// function handleImg(str = '', urlHandler = '') {
//   const res = str.replace(imgReg, (...args) => {
//     const { 1: pre, 2: src, 3: post } = args;
//     const size = getSize(pre, post, sizeReg);
//     const width = getSize(pre, post, widthReg);
//     const height = getSize(pre, post, heightReg);

//     const srcStr = getImgSrc({
//       urlHandler,
//       src,
//       size,
//       width,
//       height,
//     });
//     const innerRes = `${pre} :src="${srcStr}" lazy-load ${post}`;

//     return innerRes;
//   });
//   return res;
// }
