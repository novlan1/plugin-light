/* eslint-disable @typescript-eslint/no-require-imports */
import * as path from 'path';
import { normalizePath } from 't-comm';

import { createLogDir, saveJsonToLog, parseSetDeps, getRelativePath } from '../../helper/index';
import { traverseDeps } from './traverse-deps';
import { getScriptSubPackages }  from './script-sub-packages';
import {
  ROOT_NAME,
  VENDER_PATH,
  baseTest,
  findSubPackages,
  hasMainPackage,
  findNameChunk,
  getMainJSPath,
  getPagesList,
} from './helper';
import type { IDispatchScriptOptions, IChunks, IModule } from './types';
import { addCommonVendorCore } from '../add-common-vendor/core';
import { getPageSet } from '../dispatch-vue/helper';


const resourceResolveDataList: Array<any> = [];
const moduleSources: Array<string> = [];


export class DispatchScriptPlugin {
  options: IDispatchScriptOptions;
  moveFiles: Map<any, any>;

  pluginName = 'DispatchScriptPlugin';
  reverseDepsMap: Record<string, Set<string>>;
  handledModules: Array<{
    module: string,
    subPackages: Array<string>
  }>;

  pages: Array<string>;
  mainPath: string;

  constructor(options: IDispatchScriptOptions) {
    // if (options.addCommonVendorRequire !== false) {
    //   options.addCommonVendorRequire = true;
    // }

    this.options = options;

    this.moveFiles = new Map();
    this.pluginName = 'DispatchScriptPlugin';
    this.reverseDepsMap = {};
    this.handledModules = [];

    // 现在获取不到真正的 pages，是空数组
    this.pages = getPagesList();
    this.mainPath = getMainJSPath();
    saveJsonToLog(this.pages, 'dispatch-script.raw-pages.json');

    createLogDir();
  }

  apply(compiler: any) {
    compiler.hooks.normalModuleFactory.tap(this.pluginName, (nmf: any) => {
      nmf.hooks.afterResolve.tap(this.pluginName, (result: any) => {
        try {
          this.collectDeps(result);
        } catch (err) {
          console.warn('[DISPATCH SCRIPT] err', err);
        }
      });
    });

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation: any) => {
      compilation.hooks.optimizeChunksAdvanced.tap(this.pluginName, () => {
        try {
          this.collectShouldDispatchJS(compilation);
        } catch (err) {
          console.warn('[DISPATCH SCRIPT] err', err);
        }
      });

      compilation.hooks.optimizeChunkModules.tap(this.pluginName, (chunks: IChunks, modules: Array<IModule>) => {
        saveJsonToLog(resourceResolveDataList, 'dispatch-script.raw-resource-resolve-data-list.json');
        saveJsonToLog(moduleSources, 'dispatch-script.raw-module-sources.json');

        try {
          this.doDispatchJS({
            modules,
            chunks,
            compilation,
          });
        } catch (err) {
          console.warn('[DISPATCH SCRIPT] err', err);
        }
      });
    });

    if (this.options.addCommonVendorRequire) {
      compiler.hooks.emit.tap(this.pluginName, (compilation: any) => {
        try {
          const { assets } = compilation;

          addCommonVendorCore({
            assets,
            pageSet: Array.from(getPageSet()),
            subPackages: Object.keys((process as any).UNI_SUBPACKAGES) || {},
            outputDir: process.env.UNI_OUTPUT_DIR || '',
          });
        } catch (err) {
          console.warn('DispatchScriptPlugin.err: ', err);
        }
      });
    }
  }

  collectShouldDispatchJS(compilation: any) {
    const reverseDeps = parseSetDeps(this.reverseDepsMap);

    saveJsonToLog(getPagesList(), 'dispatch-script.raw-pages-dispatch.json');

    const handledDepsMap = traverseDeps({
      deps: reverseDeps,
      pages: getPagesList(),
      mainPath: getMainJSPath(),
    });

    saveJsonToLog(reverseDeps, 'dispatch-script.inner-deps-raw.json');
    saveJsonToLog(handledDepsMap, 'dispatch-script.inner-deps-flatten.json');

    const waitDisposeModules = compilation.modules.filter((module: IModule) => baseTest(module, this.options));
    waitDisposeModules.forEach((module: IModule) => {
      const chunks = module.getChunks();

      const matchSubPackages = findSubPackages(chunks);
      const isMain = hasMainPackage(chunks);
      const forceMovePackages = getScriptSubPackages(module.resource, handledDepsMap);

      moduleSources.push(module.resource);


      if (forceMovePackages?.length) {
        this.moveFiles.set(module, {
          name: module.resource,
          pkgSet: forceMovePackages,
        });
      } else if (matchSubPackages.size > 0 && !isMain) {
        // 只用处理大于一个分包在使用的情况，一个使用的情况 uni 已经处理好了，但是要考虑 3 的情况
        this.moveFiles.set(module, {
          name: module.resource,
          pkgSet: matchSubPackages,
        });
      }
    });
  }

  doDispatchJS({
    modules,
    chunks,
    compilation,
  }: {
    modules: Array<IModule>;
    chunks: IChunks;
    compilation: any;
  }) {
    const graphHelpers = require('webpack/lib/GraphHelpers');

    modules.forEach((module) => {
      if (this.moveFiles.has(module)) {
        const mainChunks = module.getChunks();
        // 如果不存在主包的 common/vendor 中，说明已经被 uni 放入分包了，就不需要做任何处理
        if (mainChunks.length === 1 && mainChunks[0].name === VENDER_PATH) {
          const mainChunk = mainChunks[0];
          const moveFileInfo = this.moveFiles.get(module);
          const chunkNames: Array<string> = [];
          moveFileInfo.pkgSet.forEach((value: string) => {
            /**
             * pkgSet.value 举例：
             *
             * views/room/
             * views/match/
             * views/edit/
             * views/setting/
             */
            const aPath = path.join(value, VENDER_PATH);
            chunkNames.push(normalizePath(aPath));
          });

          chunkNames.forEach((chunkName) => {
            let pkgChunk = findNameChunk(chunks, chunkName);
            if (!pkgChunk) {
              const group = compilation.addChunkInGroup(chunkName);
              pkgChunk = group.chunks[0];
            }
            graphHelpers.connectChunkAndModule(pkgChunk, module);
          });

          this.handledModules.push({
            module: getRelativePath(module.resource),
            subPackages: Array.from(moveFileInfo.pkgSet),
          });
          graphHelpers.disconnectChunkAndModule(mainChunk, module);
        }
      }
    });

    saveJsonToLog(this.handledModules, 'dispatch-script.result-handled-modules.json');
  }

  collectDeps(result: {
    resourceResolveData: Record<string, any>
  }) {
    const { resourceResolveData } = result;
    resourceResolveDataList.push({
      ...resourceResolveData,
      descriptionFileData: {},
    });

    const {
      context: {
        issuer,
        compiler = '',
      },
      path,
      query = '',
    } = resourceResolveData;


    const parent = issuer ? getRelativePath(issuer) : ROOT_NAME;
    const child = getRelativePath(path);

    if (parent === ROOT_NAME
      && typeof compiler === 'string'
      && compiler
      && compiler.indexOf('mini-css-extract-plugin') > -1
      && query
      && query.indexOf('&type=style') > -1
    ) {
      return;
    }

    if (this.reverseDepsMap[child]) {
      this.reverseDepsMap[child].add(parent);
    } else {
      this.reverseDepsMap[child] = new Set([parent]);
    }
  }
}
