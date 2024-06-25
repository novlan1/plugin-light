const INDEX_HTML = 'https://www.stats.gov.cn/sj/tjbz/tjyqhdmhcxhfdm/2023/index.html';

const CLASS_MAP = {
  PROVINCE_TABLE: 'provincetable',
  CITY_TABLE: 'citytable',
  COUNTY_TABLE: 'countytable',
  TOWN_TABLE: 'towntable',

  CITY_TR: 'citytr',
  COUNTY_TR: 'countytr',
  TOWN_TR: 'towntr',
};

const SAVE_DATA_DIR = 'script/spider-area/data';

module.exports = {
  INDEX_HTML,
  CLASS_MAP,
  SAVE_DATA_DIR,
};
