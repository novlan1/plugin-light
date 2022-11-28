
/* eslint-disable @typescript-eslint/no-require-imports */
import { getFlattenedDeps } from 't-comm';
import { parseSetDeps, getRelativePath } from '../../helper/utils/parse-deps';

const fs = require('fs');
const ROOT_NAME = 'MAIN';


function saveFile(deps, file) {
  fs.writeFileSync(file, JSON.stringify(deps, null, 2), {
    encoding: 'utf-8',
  });
}

function filterFn(child) {
  if (child.startsWith('node_modules')) {
    // return null;
  }
}


export class DepAnalysisPlugin {
  depsMap: Object;
  reverseDepsMap: Object;
  pluginName: String;

  constructor() {
    this.depsMap = {};
    this.reverseDepsMap = {};
    this.pluginName = 'DepAnalysisPlugin';

    if (!fs.existsSync('./log')) {
      fs.mkdirSync('./log');
    }
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

        saveFile(deps, './log/dep.json');
        saveFile(reverseDeps, './log/dep-reverse.json');

        const handledDepsMap = getFlattenedDeps({ deps: reverseDeps, filterFn });
        saveFile(handledDepsMap, './log/dep-flatten.json');
      } catch (err) {
        console.log('[DepAnalysisPlugin] err: ', err);
      }
    });
  }
}
