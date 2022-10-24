/* eslint-disable @typescript-eslint/no-require-imports */
const { getOptions } = require('loader-utils');
// const { parseComponent } = require('vue-template-compiler');

const hyphenateRE = /\B([A-Z])/g;
const oneTagReg = /(?<=<template>\s*)(<[^>]+\/?>)(?=\s*<\/template>)/;
const firstCommentReg = /(?<=<template>[\s\n]*(?:<!--.*?-->\s*)<div[^>]*>)([\s\S]*)(?=<\/div>[\s\n]*<\/template>)/;
const notFirstDivReg = /(?<=<template>\s*)(<(?!div)[^>]+>[\s\S]*)(?=\s*<\/template>)/;
const htmlReg = /(?<=<template>[\s\n]*<div[^>]*>)([\s\S]*)(?=<\/div>[\s\n]*<\/template>)/;

const hyphenate = function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};


export function insertGlobalComponent(source) {
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin' && process.env.VUE_APP_PLATFORM !== 'mp-qq') {
    return source;
  }

  // @ts-ignore
  const options = getOptions(this) || {};
  const { pages = [], components = [] } = options;
  // @ts-ignore
  const { resourcePath } = this;
  if (!pages.includes(resourcePath)) {
    return source;
  }
  // const parsed = parseComponent(source);
  // console.log('parsed', parsed);

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


// const a = '<template></template>';
// insertComp(a, [
//   {
//     name: 'xxxComp',
//     id: 'xxx-comp',
//   },
// ]);

// const a = `
// <template>
//   <ModuleCustomGroupType
//     :game-info-key="gameInfoKey"
//   />
// </template>
// `;


// console.log(a.match(oneTagReg));

// a.replace(oneTagReg, (a, b) => {

// });


// const res = a.replace(oneTagReg, (a, b) => `<div>${b} 123123</div>`);
// console.log('res', res);

// const a = `<template>
// <!-- 战后数据和直播页面 -->
// <div
//   class="battle-detail-wrap"
//   style="width:100%;height: 100%;"
// >
//   <page-loading v-if="mShowPageLoading" />
//   <BattleDetailModule v-else-if="isScheEnd" />
//   <VideoRoomModule v-else />
// </div>
// </template>
// <script>`;


// console.log(insertComp(a, [
//   {
//     name: '123',
//   },
// ]));
