import pathToRegexp from 'path-to-regexp';

let newRouterMap
function genRouterRegexp(rawRouterMap) {
  const newRouterMap = rawRouterMap.map((item) => {
    // eslint-disable-next-line prefer-const
    let keys = [];
    const regexp = pathToRegexp(item.path, keys);

    /**
     * keys
     * {name: "childid", prefix: "/", delimiter: "/", optional: false, repeat: false, …},
     * {name: "posterid", prefix: "/", delimiter: "/", optional: false, repeat: false, …}
     */
    // console.log('item', item);
    // console.log('keys', keys);
    // console.log('regexp', regexp);

    return {
      ...item,
      regexp,
      keys,
    };
  });
  return newRouterMap;
}



function getQueryBaseStr(str = '') {
  return str.split('&').reduce((acc, item) => {
    const list = item.split('=');
    acc[list[0]] = list[1];
    return acc;
  }, {});
}

function findRouteName(path, newRouterMap = []) {
  // console.log('path', path);
  for (let i = 0;i < newRouterMap.length;i++) {
    const item = newRouterMap[i];
    const { name, regexp, keys } = item;

    let purePath = path;
    let queryStr = '';
    if (path.includes('?')) {
      const idx = path.indexOf('?');
      purePath = path.slice(0, idx);
      queryStr = path.slice(idx + 1);
    }

    const match = purePath.match(regexp);
    const queryBasePath = getQueryBaseStr(queryStr);

    if (match?.[0]) {
      console.log('match', match, regexp);

      const params = keys.reduce((acc, key, index) => {
        const { name } = key;
        acc[name] =  match[index + 1];
        return acc;
      }, {});


      // console.log('params', name, params);

      return {
        name,
        params: {
          ...params,
          ...queryBasePath,
        },

      };
    }
  }
}

function interceptorOriginFunc(router, FuncName, originFunc) {
  router[FuncName] = function (...args) {
    // console.log('...args', args);

    let rawPath;
    let rawQuery = {};
    if (args.length === 1 && !args[0].name && args[0].path) {
      rawPath = args[0].path;
      rawQuery = args[0].query || {};
    } else if (args.length === 1 && typeof args[0] === 'string') {
      rawPath = args[0];
    }

    if (rawPath) {
      const { name, params } = findRouteName(rawPath, newRouterMap) || {};

      if (name) {
        originFunc.call(this, {
          name,
          params: {
            ...params,
            ...rawQuery,
          },
        });
        return;
      }
    }
    originFunc.call(this, ...args);
  };
}


/**
 * 拦截router.push、router.replace方法
 *
 * 适用于以下情况：
 * router.push('/somePath/:id') => router.push({ name: 'someName', id: 'id' })
 * router.push({ path '/somePath/:id' }) => router.push({ name: 'someName', id: 'id' })
 * router.push({ path '/somePath/:id', query: { uid: 1 } }) => router.push({ name: 'someName', id: 'id', uid: 1 })
 * router.push({ path '/somePath/:id?param=1', query: { uid: 1 } })
 *    => router.push({ name: 'someName', id: 'id', param: 1, uid: 1 })
 *
 * replace同上
 */
function routerInterCeptor(router, rawRouterMap) {
  newRouterMap = genRouterRegexp(rawRouterMap);
  
  const originPush = router.push;
  const originReplace = router.replace;

  interceptorOriginFunc(router, 'push', originPush);
  interceptorOriginFunc(router, 'replace', originReplace);
}

export default routerInterCeptor;
