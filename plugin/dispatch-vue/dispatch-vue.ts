import { analyzeComponent } from './analyze-component';

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};

const findReplaceMap = (key, refMap = {}) => {
  const subPackage = Object.keys(refMap).find((item) => {
    const parsedItem = item.endsWith('/') ? item : `${item}/`;
    return key.startsWith(parsedItem);
  });
  if (subPackage) {
    return refMap[subPackage];
  }
};


export class DispatchVuePlugin {
  options: object;

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('moveComponentPlugin', (compilation) => {
      const startTime = Date.now();
      console.log('Dispatch Vue Plugin Start Time: ', startTime);

      try {
        const { assets } = compilation;
        const {
          parsedReplaceRefList,
          movingComponents,
        } = analyzeComponent(this.options) || {};

        this.copyComponents(assets, movingComponents);
        this.modifyRef(assets, parsedReplaceRefList);
        this.deleteComponents(assets, movingComponents);

        const endTime = Date.now();

        console.log('Dispatch Vue Plugin End Time: ', endTime);
        console.log('Dispatch Vue Plugin Took Time: ', endTime - startTime);
      } catch (err) {
        console.log('err', err);
      }
    });
  }

  copyComponents(assets, movingComponents) {
    for (const item of movingComponents) {
      const { sourceRef, targetRef } = item;
      const origin = this.formatAssetKey(sourceRef);
      const target = this.formatAssetKey(targetRef);

      this.addCompChunk(assets, origin, target, '.js');
      this.addCompChunk(assets, origin, target, '.json');
      this.addCompChunk(assets, origin, target, '.wxml');
      this.addCompChunk(assets, origin, target, '.wxss');
    }
  }

  deleteComponents(assets, movingComponents) {
    for (const item of movingComponents) {
      const { sourceRef } = item;
      const origin = this.formatAssetKey(sourceRef);

      this.deleteFile(assets, origin, '.js');
      this.deleteFile(assets, origin, '.json');
      this.deleteFile(assets, origin, '.wxml');
      this.deleteFile(assets, origin, '.wxss');
    }
  }

  deleteFile(assets, name, postfix) {
    delete assets[name + postfix];
  }

  addCompChunk(assets, origin, target, postfix) {
    /**
     * assets 的 keys 列表示例，可以看到没有前面的 `/`
     *
     * [
     *   "views/sche/cycle-set.wxml",
     *   "views/match-detail/publish-news.wxml",
     *   "wxcomponents/vant/mixins/basic.d.ts",
     *   "local-component/module/tip-match/tip-match-detail-group-qrcode/index.json",
     * ]
     */
    if (assets[origin + postfix]) {
      const source = assets[origin + postfix].source().toString();
      assets[target + postfix] = {
        source() {
          return source;
        },
        size() {
          return source.length;
        },
      };
    }
  }

  formatReplaceRefList(replaceRefList) {
    const refMap = replaceRefList.reduce((acc, item) => {
      const { 0: origin, 1: target, 2: subPackage } = item;
      const list = [this.formatAssetKey(origin), this.formatAssetKey(target)];

      if (acc[subPackage]) {
        acc[subPackage].push(list);
      } else {
        acc[subPackage] = [list];
      }
      return acc;
    }, {});
    return refMap;
  }

  modifyRef(assets, parsedReplaceRefList) {
    const refMap = this.formatReplaceRefList(parsedReplaceRefList);

    for (const key of Object.keys(assets)) {
      const value = assets[key];
      const replaceList = findReplaceMap(key, refMap);

      if (replaceList?.length && (key.endsWith('.js') || key.endsWith('.json'))) {
        let source = value.source().toString();

        for (const replaceItem of replaceList) {
          source = source.replaceAll(replaceItem[0], replaceItem[1]);
        }

        assets[key].source = function () {
          return source;
        };
        assets[key].size = function () {
          return source.length;
        };
      }
    }
  }


  formatAssetKey(key) {
    if (key.startsWith('/')) {
      return key.slice(1);
    }
    return key;
  }
}

