const axios = require('axios');
const cheerio = require('cheerio');
const { INDEX_HTML, CLASS_MAP, SAVE_DATA_DIR } = require('./config');
const { writeFileSync } = require('t-comm');
const path = require('path');


async function spiderAreaData() {
  const provinceList = await parseProvinceHtml();
  const cityList = [];
  const countyList = [];

  saveDataToLog('province-list.json', provinceList);

  for (const item of provinceList.slice(0, 100)) {
    const { text, href } = item;
    console.log(`[正式处理]: ${text}`);

    const list = await parseCityHtml(href, text);
    cityList.push(...list);
  }
  saveDataToLog('city-list.json', cityList);


  for (const item of cityList) {
    const { text, href, parent } = item;
    console.log(`[正式处理]: ${text}`);

    if (!href) {
      continue;
    }
    const list = await parseCityHtml(href, [...parent, text], CLASS_MAP.COUNTY_TABLE, CLASS_MAP.COUNTY_TR);
    countyList.push(...list);
  }
  saveDataToLog('county-list.json', countyList);


  const areaData = generateAreaData({
    provinceList,
    cityList,
    countyList,
  });
  saveDataToLog('area-data.json', areaData);
}


async function parseProvinceHtml() {
  const { data } = await axios.get(INDEX_HTML);
  const $ = cheerio.load(data);
  const table = $('table.provincetable');
  const list = table.find('tr td a');

  const list2 = [...list].map((item) => {
    const { href } = item.attribs;

    return {
      text: $(item).text(),
      href: getNextHtml(href, INDEX_HTML),
      code: href.replace('.html', ''),
    };
  });

  return list2;
}


function getNextHtml(href, base = INDEX_HTML) {
  if (!href) {
    return '';
  }
  return base.replace(/\/([^/]+)$/, `/${href}`);
}


async function parseCityHtml(cityHref, parent, tableClass = CLASS_MAP.CITY_TABLE, trClass = CLASS_MAP.CITY_TR) {
  const { data } = await axios.get(cityHref).catch((err) => {
    console.log('[err]', err);
  });
  const $ = cheerio.load(data);
  const table = $(`table.${tableClass}`);
  const list = table.find(`tr.${trClass}`);

  const result = [...list].map((item) => {
    const subs = [...$(item).find('td a')].map(it => ({
      href: getNextHtml(it.attribs.href, cityHref),
      text: $(it).text(),
    }));

    if (subs.length) {
      return {
        code: subs[0].text,
        text: subs[1].text,
        href: subs[0].href,
        parent: Array.isArray(parent) ? parent : [parent],
      };
    }
    return '';
  }).filter(item => item);


  return result;
}

function generateAreaData({
  provinceList,
  cityList,
  countyList,
}) {
  const innerParse = list => list.reduce((acc, item) => ({
    [parseCode(item.code)]: parseText(item.text, item.parent),
    ...acc,
  }), {});

  return {
    province_list: innerParse(provinceList),
    city_list: innerParse(cityList),
    county_list: innerParse(countyList),
  };
}

function parseCode(code) {
  const temp = (`${code}`).slice(0, 6);
  if (temp.length < 6) {
    return temp.padEnd(6, '0');
  }
  return temp;
}

function parseText(text, parent) {
  if (text === '市辖区' && parent.length === 1) {
    return parent[0];
  }
  return text;
}


function saveDataToLog(fileName, data) {
  writeFileSync(path.resolve(SAVE_DATA_DIR, fileName), data, true);
}

module.exports = {
  spiderAreaData,
};
