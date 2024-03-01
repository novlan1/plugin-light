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
} from './helper';
import type { IDispatchScriptOptions, IChunks, IModule } from './types';


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

  constructor(options: IDispatchScriptOptions) {
    this.options = options;
    this.moveFiles = new Map();
    this.pluginName = 'DispatchScriptPlugin';
    this.reverseDepsMap = {};
    this.handledModules = [];

    createLogDir();
  }

  apply(compiler: any) {
    compiler.hooks.normalModuleFactory.tap(this.pluginName, (nmf: any) => {
      nmf.hooks.afterResolve.tap(this.pluginName, (result: any) => {
        try {
          this.collectDeps(result);
        } catch (err) {
          console.log('[DISPATCH SCRIPT] err', err);
        }
      });
    });

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation: any) => {
      compilation.hooks.optimizeChunksAdvanced.tap(this.pluginName, () => {
        try {
          this.collectShouldDispatchJS(compilation);
        } catch (err) {
          console.log('[DISPATCH SCRIPT] err', err);
        }
      });

      compilation.hooks.optimizeChunkModules.tap(this.pluginName, (chunks: IChunks, modules: Array<IModule>) => {
        saveJsonToLog(resourceResolveDataList, 'dispatch-script.resource-resolve-data-list.json');
        saveJsonToLog(moduleSources, 'dispatch-script.module-sources.json');

        try {
          this.doDispatchJS({
            modules,
            chunks,
            compilation,
          });
        } catch (err) {
          console.log('[DISPATCH SCRIPT] err', err);
        }
      });
    });
  }

  collectShouldDispatchJS(compilation: any) {
    const reverseDeps = parseSetDeps(this.reverseDepsMap);
    const handledDepsMap = traverseDeps(reverseDeps);

    saveJsonToLog(reverseDeps, 'dispatch-script.deps-raw.json');
    saveJsonToLog(handledDepsMap, 'dispatch-script.deps-flatten.json');

    const waitDisposeModules = compilation.modules.filter((module: IModule) => baseTest(module, this.options));
    waitDisposeModules.forEach((module: IModule) => {
      const chunks = module.getChunks();

      const matchSubPackages = findSubPackages(chunks);
      const isMain = hasMainPackage(chunks);
      const forceMovePackages = getScriptSubPackages(module.resource, handledDepsMap);

      moduleSources.push(module.resource);

      // console.log('[DISPATCH SCRIPT] module.resource: ', module.resource);
      // console.log('[DISPATCH SCRIPT] forceMovePackages: ', forceMovePackages);
      // console.log('[DISPATCH SCRIPT] isMain: ', !!isMain);

      if (forceMovePackages?.length) {
        this.moveFiles.set(module, {
          name: module.resource,
          pkgSet: forceMovePackages,
        });
      } else if (matchSubPackages.size > 0 && !isMain) {
        // 只用处理大于一个分包在使用的情况，一个使用的情况uni已经处理好了，但是要考虑3的情况
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
        // 如果不存在主包的common/vendor中，说明已经被uni放入分包了，就不需要做任何处理
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
            const aPath = path.join(value, VENDER_PATH) as any;
            // @ts-ignore
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

          // console.log(`[DISPATCH SCRIPT] 正在移动脚本 ${getRelativePath(module.resource)}
          // 到分包 ${Array.from(moveFileInfo.pkgSet).join(',')} 中`);

          this.handledModules.push({
            module: getRelativePath(module.resource),
            subPackages: Array.from(moveFileInfo.pkgSet),
          });
          graphHelpers.disconnectChunkAndModule(mainChunk, module);
        }
      }
    });

    saveJsonToLog(this.handledModules, 'dispatch-script.handled-modules.json');
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

    // console.log('[DISPATCH SCRIPT] issuer', issuer);
    // console.log('[DISPATCH SCRIPT] path', path);

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
