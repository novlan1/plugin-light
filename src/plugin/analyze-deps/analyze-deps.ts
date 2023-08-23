import { getFlattenedDeps } from 't-comm';
import { ROOT_NAME, saveJsonToLog, createLogDir, parseSetDeps, getRelativePath } from '../../helper/index';

export class DepAnalysisPlugin {
  depsMap: Object;
  reverseDepsMap: Object;
  pluginName: String;

  constructor() {
    this.depsMap = {};
    this.reverseDepsMap = {};
    this.pluginName = 'DepAnalysisPlugin';

    createLogDir();
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(this.pluginName, (nmf) => {
      nmf.hooks.afterResolve.tap(this.pluginName, (result) => {
        const { resourceResolveData } = result;
        const {
          context: {
            issuer,
          },
          path,
        } = resourceResolveData;

        // console.log('[DepAnalysisPlugin] issuer', issuer);
        // console.log('[DepAnalysisPlugin] path', path);

        const parent = issuer ? getRelativePath(issuer) : ROOT_NAME;
        const child = getRelativePath(path);

        if (this.depsMap[parent]) {
          this.depsMap[parent].add(child);
        } else {
          this.depsMap[parent] = new Set([child]);
        }

        if (this.reverseDepsMap[child]) {
          this.reverseDepsMap[child].add(parent);
        } else {
          this.reverseDepsMap[child] = new Set([parent]);
        }
      });
    });

    compiler.hooks.done.tap(this.pluginName, async () => {
      try {
        const deps = parseSetDeps(this.depsMap);
        const reverseDeps = parseSetDeps(this.reverseDepsMap);

        saveJsonToLog(deps, 'analyze-deps.dep.json');
        saveJsonToLog(reverseDeps, 'analyze-deps.dep-reverse.json');

        const handledDepsMap = getFlattenedDeps(reverseDeps);
        saveJsonToLog(handledDepsMap, 'analyze-deps.dep-flatten.json');
      } catch (err) {
        console.log('[DepAnalysisPlugin] err: ', err);
      }
    });
  }
}
