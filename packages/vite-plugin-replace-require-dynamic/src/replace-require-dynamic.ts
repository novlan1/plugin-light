/**
 * Vite 插件 - 将 `aComp(resolve){ require(['xx.vue'], resolve) }` 转为 `aComp: () => import('xx.vue')`
 */
export function replaceRequireDynamicVitePlugin() {
  return {
    name: 'vite-plugin-replace-dynamic-import',
    transform(source: string, id: string) {
      if (id.indexOf('.vue') === -1) {
        return {
          code: source,
          map: null,
        };
      }

      const reg = new RegExp(/([a-zA-Z]+?)\(resolve\)(?:\s*?)\{(?:\n\s*)require\(\['(.*?)'\],(?:\s*?)resolve\);(?:\n\s*)\}/, 'g');
      const match = source.match(reg);

      if (match?.[1] && match[2]) {
        const res = source.replace(reg, (match, originA, originB) => `${originA}: () => import('${originB}')`);
        return {
          code: res,
          map: null,
        };
      }

      return {
        code: source,
        map: null,
      };
    },
  };
}

