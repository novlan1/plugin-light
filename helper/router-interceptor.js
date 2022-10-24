import pathToRegexp from 'path-to-regexp';


function getQueryBaseStr(str = '') {
  return str.split('&').reduce((acc, item) => {
    const list = item.split('=');
    acc[list[0]] = list[1];
    return acc;
  }, {});
}

function isMatchPath(meta = {}, path) {
  const { rawPath } = meta;
  if (!rawPath?.length) return;
  for (const item of rawPath) {
    // eslint-disable-next-line prefer-const
    let keys = [];
    const regexp = pathToRegexp(item, keys);
    const match = path.match(regexp);

    if (match) {
      return {
        match,
        regexp,
        keys,
      };
    }
  }

  return;
}


function findRouteName(path) {
  // eslint-disable-next-line no-undef
  const routes = ROUTES || [];
  for (let i = 0;i < routes.length;i++) {
    const item = routes[i];
    const { name,  meta = {} } = item;

    let purePath = path;
    let queryStr = '';
    if (path.includes('?')) {
      const idx = path.indexOf('?');
      purePath = path.slice(0, idx);
      queryStr = path.slice(idx + 1);
    }

    const match = isMatchPath(meta, purePath);

    const queryBasePath = getQueryBaseStr(queryStr);
    if (match) {
      const { match: iMatch, keys } = match;

      const params = keys.reduce((acc, key, index) => {
        const { name } = key;
        acc[name] =  iMatch[index + 1];
        return acc;
      }, {});


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
    let rawPath;
    let rawQuery = {};
    if (args.length === 1 && !args[0].name && args[0].path) {
      rawPath = args[0].path;
      rawQuery = args[0].query || {};
    } else if (args.length === 1 && typeof args[0] === 'string') {
      rawPath = args[0];
    }

    if (rawPath) {
      const { name, params } = findRouteName(rawPath) || {};

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
function routerInterCeptor(router) {
  const originPush = router.push;
  const originReplace = router.replace;

  interceptorOriginFunc(router, 'push', originPush);
  interceptorOriginFunc(router, 'replace', originReplace);
}

export default routerInterCeptor;
