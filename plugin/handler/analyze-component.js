const path = require('path');
const fs = require('fs');
const {
  getPageSet,
  getJsonFileMap,
} = require('@dcloudio/uni-cli-shared/lib/cache');
const { execSync } = require('child_process');

const usingComponentsMap = {};
const usingComponentsMap2 = {};
const usingComponentsMap3 = {};
const outputDir = process.env.UNI_OUTPUT_DIR;

function savingUsingComponentMap(name, map) {
  const res = Object.keys(map).reduce((acc, item) => {
    acc[item] = [...map[item]];
    return acc;
  }, {});
  fs.writeFileSync(name, JSON.stringify(res, null, 2));
}

function _strMapToObj(strMap) {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

/**
*map转换为json
*/
function _mapToJson(map) {
  return JSON.stringify(_strMapToObj(map), null, 4);
}

function flattenUsingComponentMap(map) {
  const res = {};
  function cursive(obj = {}, list = []) {
    Object.keys(obj).map((key) => {
      const value = map[key];
      if (value) {
        list.push(...Object.keys(value));
        // console.log('key', key, list.includes(key));

        // let has = true;
        // for (const key2 of Object.keys(value)) {
        //   if (!list.includes(key2)) {
        //     has = false;
        //   }
        // }
        // console.log('has', has);
        // if (!has) {
        cursive(value, list);
        // }
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
  // fs.writeFileSync('./flattenUsingComponentMap-3.json', JSON.stringify(res, null, 2));
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

function analyzeUsingComponents() {
  if (!process.env.UNI_OPT_SUBPACKAGES) return;

  let subPackages = [];
  try {
    subPackages = require(path.resolve(process.env.UNI_INPUT_DIR, './config')).subPackageRoots;
  } catch (err) {
    console.log('err', err);
  }
  // console.log('process.env.UNI_OPT_SUBPACKAGES', process.env.UNI_OPT_SUBPACKAGES);
  // console.log('subPackages', subPackages);

  if (!subPackages?.length) return;

  const pageSet = getPageSet();
  const jsonFileMap = getJsonFileMap();
  // console.log('jsonFileMap', jsonFileMap);
  // fs.writeFileSync('./jsonFileMap.json', _mapToJson(jsonFileMap));
  // fs.writeFileSync('./pageSet.json', JSON.stringify(Array.from(pageSet)));
  // fs.writeFileSync('./SUBPACKAGES.json', JSON.stringify(process.env.UNI_OPT_SUBPACKAGES));

  // usingComponentsMap2[name] = {}
  function genComponentMap(usingComponentsMap3) {
    Object.keys(usingComponentsMap3).map((page) => {
      const compObj = usingComponentsMap3[page];
      /**
       * {
       *   '../../local-component/module/xx': {}
       * }
       */
      Object.keys(compObj).map((comp) => {
        if (usingComponentsMap3[comp]) {
          compObj[comp] = usingComponentsMap3[comp];
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

  // 生成所有组件引用关系
  for (const name of jsonFileMap.keys()) {
    const jsonObj = JSON.parse(jsonFileMap.get(name));
    const { usingComponents } = jsonObj;
    usingComponentsMap3[name] = handleUsingComponents(usingComponents);
    // console.log('usingComponentsMap3', usingComponentsMap3);

    if (!usingComponents || !pageSet.has(name)) {
      continue;
    }
    usingComponentsMap2[name] = {};

    Object.keys(usingComponents).forEach((componentName) => {
      const componentPath = usingComponents[componentName].slice(1);
      if (!usingComponentsMap[componentPath]) {
        usingComponentsMap[componentPath] = new Set();
      }
      usingComponentsMap[componentPath].add(name);

      usingComponentsMap2[name][componentPath] = { componentPath };
    });

    //  生成所有组件递归引用关系
    Object.keys(usingComponentsMap2).forEach((name) => {
      Object.keys(usingComponentsMap2[name]).forEach((componentName) => {
        // console.log('componentName123', componentName);
        const usingComponents = usingComponentsMap2[componentName.slice(1)];
        // console.log('usingComponents123', usingComponents);
        if (usingComponents) {
          usingComponentsMap2[name][componentName] = usingComponents;
        }
      });
    });
  }

  genComponentMap(usingComponentsMap3);
  // usingComponentsMap3 = JSON.decycle(usingComponentsMap3);
  // console.log('usingComponentsMap3', usingComponentsMap3);

  let allUsingComponentMap = {};
  try {
    // fs.writeFileSync('./usingComponentsMap3.json', JSON.stringify(usingComponentsMap3, null, 2));
    const flattenUsingComponent = flattenUsingComponentMap(usingComponentsMap3);
    allUsingComponentMap = handleComponentMap(flattenUsingComponent, pageSet);
  } catch (err) {
    console.log('err', err);
  }


  // console.log('usingComponentsMap', usingComponentsMap);

  const subPackageRoots = Object.keys(process.UNI_SUBPACKAGES);

  // console.log('subPackageRoots', process.UNI_SUBPACKAGES);

  // const findSubPackage = function (pages) {
  //   const pkgs = new Set();
  //   for (let i = 0; i < pages.length; i++) {
  //     const pagePath = pages[i];
  //     const pkgRoot = subPackageRoots.find(root => pagePath.indexOf(root) === 0);
  //     if (!pkgRoot) { // 被非分包引用
  //       return false;
  //     }
  //     pkgs.add(pkgRoot);
  //     if (pkgs.size > 1) { // 被多个分包引用
  //       return false;
  //     }
  //   }
  //   return [...pkgs][0];
  // };

  const findSubPackages = function (pages) {
    const pkgs = [];
    for (let i = 0; i < pages.length; i++) {
      const pagePath = pages[i];
      const pkgRoot = subPackageRoots.filter(root => pagePath.indexOf(root) === 0);
      if (!pkgRoot.length) { // 被非分包引用
        return [];
      }
      pkgs.push(...pkgRoot);
      // if (pkgs.size > 1) { // 被多个分包引用
      //   return false;
      // }
    }
    return pkgs;
  };

  function getNewPosName(component) {
    const list = component.split('/').filter(item => item !== '..');
    return [list.slice(0, list.length - 1).join('-'), list[list.length - 1]];
  }

  function mvComp(source, target) {
    if (fs.existsSync(source)) {
      execSync(`cp -f ${source} ${target}`, {
        stdio: 'inherit',
      });
    }
  }

  function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
      if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
        arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
      } else {
        if (file.endsWith('.json') || file.endsWith('.js')) {
          arrayOfFiles.push(path.join(dirPath, '/', file));
        }
      }
    });

    return arrayOfFiles;
  }

  function modifyRef(adapterDirs) {
    // console.log('adapterDirs', adapterDirs);
    const jsonFiles = getAllFiles(path.resolve(process.env.UNI_OUTPUT_DIR));
    jsonFiles.forEach((file) => {
      let source = fs.readFileSync(file).toString();
      adapterDirs.forEach((item) => {
        source = source.replaceAll(item[0], item[1]);
      });
      fs.writeFileSync(file, source);
    });
  }

  function mvComponent(component, subPackage) {
    // const dir = path.dirname(compJs);

    const [newPosName, fileName] = getNewPosName(component);
    const target = path.resolve(outputDir, subPackage, newPosName);

    const originRef = `/${component.replace('../../', '')}`;

    const comp = path.resolve(outputDir, `./${originRef}`);
    const compJs = `${comp}.js`;
    const compJson = `${comp}.json`;
    const compWxml = `${comp}.wxml`;
    const compWxss = `${comp}.wxss`;
    // console.log('comp', comp);

    const sourceRef = path.resolve(target.replace(outputDir, ''), fileName);

    // setTimeout(() => {
    // console.log('compJs', compJs);
    // console.log('target', target);

    if (!fs.existsSync(target)) {
      execSync(`mkdir ${target}`, {
        stdio: 'inherit',
      });
    }

    mvComp(compJson, target);
    mvComp(compJs, target);
    mvComp(compWxml, target);
    mvComp(compWxss, target);
    // }, 1000);

    // console.log('originRef', originRef);
    // console.log('sourceRef', sourceRef);
    return {
      originRef,
      sourceRef,
      compJs,
      compJson,
      compWxml,
      compWxss,
    };
  }
  const replaceRefList = [];

  // fs.writeFileSync('./usingComponentsMap.json', JSON.stringify(usingComponentsMap, null, 2));

  // Object.keys(usingComponentsMap).forEach((componentName) => {
  //   const subPackage = findSubPackage([...usingComponentsMap[componentName]]);
  //   if (subPackage && componentName.indexOf(subPackage) !== 0) { // 仅存在一个子包引用且未在该子包
  //     console.warn(`111自定义组件 ${componentName} 建议移动到子包 ${subPackage} 内`);
  //     console.log('process.env.UNI_OUTPUT_DIR', process.env.UNI_OUTPUT_DIR, outputDir);
  //     const { originRef, sourceRef } = mvComponent(componentName, subPackage);
  //     replaceRefList.push([originRef, sourceRef]);
  //   }
  // });

  savingUsingComponentMap('./allUsingComponentMap.json', allUsingComponentMap);
  savingUsingComponentMap('./usingComponentsMap.json', usingComponentsMap);

  const movingComponents = [];

  Object.keys(allUsingComponentMap).forEach((componentName) => {
    // const subPackage = findSubPackage([...allUsingComponentMap[componentName]]);
    // const pkgRoot = subPackageRoots.find(root => componentName.indexOf(root) === 0);

    // console.log('pkgRoot', pkgRoot);
    // console.log('componentName', componentName);
    // if (subPackage && !pkgRoot && componentName.indexOf(subPackage) !== 0) { // 仅存在一个子包引用且未在该子包
    //   console.warn(`自定义组件 ${componentName} 正移动到子包 ${subPackage} 内`);
    //   const {
    //     originRef,
    //     sourceRef,
    //     compJs,
    //     compJson,
    //     compWxml,
    //     compWxss,
    //   } = mvComponent(componentName, subPackage);

    //   replaceRefList.push([originRef, sourceRef]);

    //   movingComponents.push({
    //     compJs,
    //     compJson,
    //     compWxml,
    //     compWxss,
    //   });
    // }

    const subPackages = findSubPackages([...allUsingComponentMap[componentName]]);
    const pkgRoot = subPackageRoots.find(root => componentName.indexOf(root) === 0);
    if (!pkgRoot) {
      subPackages.forEach((subPackage) => {
        // console.log('subPackage', subPackage);
        if (subPackage && componentName.indexOf(subPackage) !== 0) { // 仅存在一个子包引用且未在该子包
          // console.warn(`自定义组件 ${componentName} 正移动到子包 ${subPackage} 内`);
          const {
            originRef,
            sourceRef,
            compJs,
            compJson,
            compWxml,
            compWxss,
          } = mvComponent(componentName, subPackage);

          replaceRefList.push([originRef, sourceRef]);

          movingComponents.push({
            compJs,
            compJson,
            compWxml,
            compWxss,
          });
        }
      });
    }
  });

  deleteOriginComponent(movingComponents);

  modifyRef(replaceRefList);
}

function deleteOriginComponent(movingComponents = []) {
  movingComponents.map((item) => {
    const {
      compJs,
      compJson,
      compWxml,
      compWxss,
    } = item;
    deleteFile(compJs);
    deleteFile(compJson);
    deleteFile(compWxml);
    deleteFile(compWxss);
  });
}

function deleteFile(target) {
  if (fs.existsSync(target)) {
    // console.log('deleteFile: ', target);
    execSync(`rm -rf ${target}`, {
      stdio: 'inherit',
    });
  }
}

module.exports = analyzeUsingComponents;
