const path = require('path');
const fs = require('fs');
const {
  getPageSet,
  getJsonFileMap,
} = require('@dcloudio/uni-cli-shared/lib/cache');


let MOVE_COMPONENT_MIN_DISABLE_LIST = [];
let MOVE_COMPONENT_MIN_USE_TIMES = 100;

const outputDir = process.env.UNI_OUTPUT_DIR;
const usingComponentsMap = {};


function savingUsingComponentMap(name, map) {
  const res = Object.keys(map).reduce((acc, item) => {
    acc[item] = [...map[item]];
    return acc;
  }, {});
  fs.writeFileSync(name, JSON.stringify(res, null, 2));
}

function strMapToObj(strMap) {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

/**
*map转换为json
*/
function mapToJson(map) {
  return JSON.stringify(strMapToObj(map), null, 4);
}

function flattenUsingComponentMap(map) {
  const res = {};
  function cursive(obj = {}, list = []) {
    Object.keys(obj).map((key) => {
      const value = map[key];
      if (value) {
        list.push(...Object.keys(value));

        cursive(value, list);
      }
    });
  }

  Object.keys(map).map((key) => {
    const temp = [];
    const value = map[key];

    if (value) {
      temp.push(...Object.keys(value));
    }
    cursive(value, temp);

    res[key] = temp;
  });
  fs.writeFileSync('./log/flattenUsingComponentMap.json', JSON.stringify(res, null, 2));
  return res;
}

function handleComponentMap(map, pageSet) {
  const res = {};
  for (const name of Object.keys(map)) {
    if (!pageSet.has(name)) {
      continue;
    }
    const value = map[name] || [];
    for (const key of value) {
      if (!res[key]) {
        res[key] = new Set();
      }
      res[key].add(name);
    }
  }
  return res;
}

function analyzeUsingComponents(options = []) {
  if (!process.env.UNI_OPT_SUBPACKAGES) return;
  if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
  }
  MOVE_COMPONENT_MIN_USE_TIMES = options?.moveComponents?.minUseTimes || MOVE_COMPONENT_MIN_USE_TIMES;
  MOVE_COMPONENT_MIN_DISABLE_LIST = options?.moveComponents?.disableList || [];

  const pageSet = getPageSet();
  const jsonFileMap = getJsonFileMap();

  fs.writeFileSync('./log/jsonFileMap.json', mapToJson(jsonFileMap));
  fs.writeFileSync('./log/pageSet.json', JSON.stringify(Array.from(pageSet)));
  fs.writeFileSync('./log/SUBPACKAGES.json', JSON.stringify(process.env.UNI_OPT_SUBPACKAGES));

  function genComponentMap(usingComponentsMap) {
    Object.keys(usingComponentsMap).map((page) => {
      const compObj = usingComponentsMap[page];
      Object.keys(compObj).map((comp) => {
        if (usingComponentsMap[comp]) {
          compObj[comp] = usingComponentsMap[comp];
        }
      });
    });
  }

  function handleUsingComponents(usingComponents = {}) {
    return Object.keys(usingComponents).reduce((acc, item) => {
      const compPath = usingComponents[item].slice(1);
      acc[compPath] = {};
      return acc;
    }, {});
  }

  function formatComponentPath(comps = [], curPath) {
    return comps.reduce((acc, item) => {
      let key = item;
      if (!key.startsWith('/')) {
        const list = curPath.split('/');

        key = `/${list.slice(0, list.length - 1).join('/')}/${key}`;
      }

      acc[item] = key;
      return acc;
    }, {});
  }


  // 处理genericComponents
  for (const name of jsonFileMap.keys()) {
    const jsonObj = JSON.parse(jsonFileMap.get(name));
    let { usingComponents = {} } = jsonObj;
    const { genericComponents = [] } = jsonObj;

    const parsedGeneric = formatComponentPath(genericComponents, name) || {};
    usingComponents = {
      ...parsedGeneric,
      ...usingComponents,
    };

    usingComponentsMap[name] = handleUsingComponents(usingComponents);
    if (!usingComponents || !pageSet.has(name)) {
      continue;
    }
  }

  genComponentMap(usingComponentsMap);

  let allUsingComponentMap = {};
  try {
    const flattenUsingComponent = flattenUsingComponentMap(usingComponentsMap);
    allUsingComponentMap = handleComponentMap(flattenUsingComponent, pageSet);
    fs.writeFileSync('./log/usingComponentsMap.json', JSON.stringify(usingComponentsMap, null, 2));
  } catch (err) {
    console.log('err', err);
  }

  const subPackageRoots = Object.keys(process.UNI_SUBPACKAGES);
  fs.writeFileSync('./log/UNI_SUBPACKAGES.json', JSON.stringify(process.UNI_SUBPACKAGES, null, 2));

  const findSubPackages = function (pages) {
    const pkgs = [];
    for (let i = 0; i < pages.length; i++) {
      const pagePath = pages[i];
      //  subPackageRoots，形如views/match, views/sche
      const pkgRoot = subPackageRoots.filter(root => pagePath.indexOf(root) === 0);
      if (!pkgRoot.length) { // 被非分包引用
        return [];
      }
      pkgs.push(...pkgRoot);
    }
    return pkgs;
  };

  function getNewPosName(component) {
    const list = component.split('/').filter(item => item !== '..');
    const folderName = list.slice(0, list.length - 1).join('-')
      .replaceAll('tip-match', 'tm')
      .replaceAll('local-component-module', 'lcm')
      .replaceAll('local-component-ui', 'lcu');
    return [folderName, list[list.length - 1]];
  }

  function mvComponent(component, subPackage) {
    const [newPosName, fileName] = getNewPosName(component);
    const target = path.resolve(outputDir, subPackage, newPosName);

    const originRef = `/${component.replace('../../', '')}`;

    const comp = path.resolve(outputDir, `./${originRef}`);
    const compJs = `${comp}.js`;
    const compJson = `${comp}.json`;
    const compWxml = `${comp}.wxml`;
    const compWxss = `${comp}.wxss`;

    const sourceRef = path.join(target.replace(outputDir, ''), fileName)
      .split(path.sep)
      .join('/');

    console.log(`正在移动组件 ${comp} 到 ${target} 中`);

    return {
      target,
      newPosName,
      originRef,
      sourceRef,
      compJs,
      compJson,
      compWxml,
      compWxss,
    };
  }
  const replaceRefList = [];

  savingUsingComponentMap('./log/allUsingComponentMap.json', allUsingComponentMap);

  const movingComponents = [];

  Object.keys(allUsingComponentMap).forEach((componentName) => {
    const subPackages = findSubPackages([...allUsingComponentMap[componentName]]);
    const pkgRoot = subPackageRoots.find(root => componentName.indexOf(root) === 0);
    if (!pkgRoot && subPackages.length && subPackages.length <= MOVE_COMPONENT_MIN_USE_TIMES) {
      subPackages.forEach((subPackage) => {
        const disable = !!MOVE_COMPONENT_MIN_DISABLE_LIST.find(item => componentName.includes(item));
        if (disable) {
          console.log('componentName', componentName);
        }
        if (subPackage && componentName.indexOf(subPackage) !== 0 && !disable) { // 仅存在一个子包引用且未在该子包
          const {
            originRef,
            sourceRef,
            compJs,
            compJson,
            compWxml,
            compWxss,
            target,
            newPosName,
          } = mvComponent(componentName, subPackage);

          replaceRefList.push([originRef, sourceRef, subPackage]);

          movingComponents.push({
            compJs,
            compJson,
            compWxml,
            compWxss,
            target,
            newPosName,
            originRef,
            sourceRef,
            subPackage,
            subPackages,
          });
        }
      });
    }
  });

  const parsedReplaceRefList = Array.from(new Set(replaceRefList.map(item => JSON.stringify(item))))
    .map(item => JSON.parse(item));

  fs.writeFileSync('./log/parsedReplaceRefList.json', JSON.stringify(parsedReplaceRefList, null, 2));

  const parsedMovingComponents = Array.from(new Set(movingComponents.map(item => JSON.stringify(item))))
    .map(item => JSON.parse(item));
  fs.writeFileSync('./log/movingComponents.json', JSON.stringify(parsedMovingComponents, null, 2));

  return {
    parsedReplaceRefList,
    movingComponents,
  };
}


module.exports = analyzeUsingComponents;
