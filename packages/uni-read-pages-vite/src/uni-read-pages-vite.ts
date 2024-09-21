import path from 'path';
import fs from 'fs';

const CONFIG = {
  includes: ['path', 'aliasPath', 'name'],
};
const rootPath = path.resolve(process.cwd(), 'node_modules');

/** 解析绝对路径
 * @param {Object} dir
 */
function resolvePath(dir: string) {
  return path.resolve(rootPath, dir);
}

export class TransformPages {
  CONFIG: Record<string, Array<string>>;
  uniPagesJSON: Record<string, any>;
  routes: Record<string, any>;

  constructor(config?: Record<string, Array<string>>) {
    config = {
      ...CONFIG,
      ...(config || {}),
    };
    this.CONFIG = config;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    this.uniPagesJSON = require(resolvePath('@dcloudio/uni-cli-shared/dist/json/pages.js'));
    this.routes = this.getPagesRoutes().concat(this.getNotMpRoutes());
  }
  /**
	 * 获取所有pages.json下的内容 返回json
	 */
  get pagesJson() {
    const { normalizePagesJson } = this.uniPagesJSON;
    const jsonFile = path.resolve(process.env.UNI_INPUT_DIR || '', 'pages.json');
    const code = fs.readFileSync(jsonFile, {
      encoding: 'utf-8',
    });

    const pagesJson = normalizePagesJson(code, process.env.UNI_PLATFORM);

    return pagesJson;
  }
  /**
	 * 通过读取pages.json文件 生成直接可用的routes
	 */
  getPagesRoutes(pages = this.pagesJson.pages, rootPath = null) {
    const routes = [];
    for (let i = 0; i < pages.length; i++) {
      const item = pages[i];
      const route: Record<string, any> = {};
      for (const key of this.CONFIG.includes) {
      // for (let j = 0; j < this.CONFIG.includes.length; j++) {
      //   const key = this.CONFIG.includes[j];
        let value = item[key];
        if (key === 'path') {
          value = rootPath ? `/${rootPath}/${value}` : `/${value}`;
        }
        if (key === 'aliasPath' && i == 0 && rootPath == null) {
          route[key] = route[key] || '/';
        } else if (value !== undefined) {
          route[key] = value;
        }
      }
      routes.push(route);
    }
    return routes;
  }
  /**
	 * 解析小程序分包路径
	 */
  getNotMpRoutes() {
    const {
      subPackages,
    } = this.pagesJson;
    let routes: Array<Record<string, any>> = [];
    if (subPackages == null || subPackages.length == 0) {
      return [];
    }
    for (const subPackage of subPackages) {
    // for (let i = 0; i < subPackages.length; i++) {
      const subPages = subPackage.pages;
      const { root } = subPackage;
      const subRoutes = this.getPagesRoutes(subPages, root);
      routes = routes.concat(subRoutes);
    }
    return routes;
  }
  /**
	 * 单条page对象解析
	 * @param {Object} pageCallback
	 * @param {Object} subPageCallback
	 */
  parsePages(pageCallback: Function, subPageCallback: Function) {
    this.uniPagesJSON.parsePages(this.pagesJson, pageCallback, subPageCallback);
  }
}
