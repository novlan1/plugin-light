
import * as path from 'path';
import { analyzeComponent } from './analyze-component';
import { fixNpmPackage } from '../fix-npm-package/core';
import { formatTime, findReplaceMap, replaceAllPolyfill, formatReplaceRefList } from './helper';

import { saveLoaderLog } from '../../helper/loader-log';
import { PLATFORM_MAP, HTML_MAP, CSS_MAP } from '../../helper/config';
import { createLogDir, updateAssetSource, removeFirstSlash } from '../../helper/index';

import type { IDispatchVueOptions, IMovingComponents, IReplaceRefList } from './types';


replaceAllPolyfill();


export class DispatchVuePlugin {
  options: IDispatchVueOptions;
  useFixNpm: boolean;
  insertRequireVendor: boolean;
  startTime: number;

  postFix: {
    html: typeof HTML_MAP[keyof typeof HTML_MAP];
    css: typeof CSS_MAP[keyof typeof CSS_MAP];
  };

  constructor(options: IDispatchVueOptions) {
    this.options = options;
    this.useFixNpm = options?.useFixNpm || true;
    this.insertRequireVendor = options?.insertRequireVendor || false;
    this.startTime = 0;

    this.postFix = {
      html: HTML_MAP.MP_WX,
      css: CSS_MAP.MP_WX,
    };

    if (process.env.UNI_PLATFORM === PLATFORM_MAP.MP_QQ) {
      this.postFix = {
        html: HTML_MAP.MP_QQ,
        css: CSS_MAP.MP_QQ,
      };
    } else if (process.env.UNI_PLATFORM == PLATFORM_MAP.MP_ALIPAY) {
      this.postFix = {
        html: HTML_MAP.MP_ALIPAY,
        css: CSS_MAP.MP_ALIPAY,
      };
    }

    createLogDir();
  }

  apply(compiler: any) {
    compiler.hooks.emit.tap('moveComponentPlugin', (compilation: any) => {
      this.startTime = Date.now();
      console.log('[Dispatch Vue] Plugin Start Time: ', formatTime(this.startTime));

      try {
        const { assets } = compilation;
        const {
          parsedReplaceRefList,
          movingComponents,
        } = analyzeComponent(this.options) || {};
        if (!movingComponents || !parsedReplaceRefList) {
          return;
        }

        this.copyComponents(assets, movingComponents);
        this.modifyRef(assets, parsedReplaceRefList);
        this.deleteComponents(assets, movingComponents);
        if (this.useFixNpm) {
          fixNpmPackage(assets);
        }

        const endTime = Date.now();

        console.log('[Dispatch Vue] Plugin End Time: ', formatTime(endTime));
        console.log('[Dispatch Vue] Plugin Took Time: ', `${endTime - this.startTime}ms`);

        saveLoaderLog();
      } catch (err) {
        console.warn('[Dispatch Vue] err', err);
      }
    });
  }

  copyComponents(assets: Record<string, any>, movingComponents: IMovingComponents) {
    for (const item of movingComponents) {
      const { sourceRef, targetRef, subPackage } = item;
      const origin = removeFirstSlash(sourceRef);
      const target = removeFirstSlash(targetRef);

      const vendor = [subPackage, 'common/vendor.js'].join('/');
      let insertCode = '';

      if (assets[vendor] && this.insertRequireVendor) {
        console.log('[copyComponents] 存在vendor', vendor);
        const vendorRelativePath = path.relative(path.dirname(path.resolve(target)), path.resolve(vendor))
          .split(path.sep)
          .join('/');
        console.log('[copyComponents] vendorRelativePath', vendorRelativePath);

        insertCode = `require('${vendorRelativePath}');`;
      }
      this.addCompChunk(assets, origin, target, '.js', insertCode);
      this.addCompChunk(assets, origin, target, '.json');
      this.addCompChunk(assets, origin, target, this.postFix.html);
      this.addCompChunk(assets, origin, target, this.postFix.css);
    }
  }

  deleteComponents(assets: Record<string, any>, movingComponents: IMovingComponents) {
    for (const item of movingComponents) {
      const { sourceRef } = item;
      const origin = removeFirstSlash(sourceRef);

      this.deleteFile(assets, origin, '.js');
      this.deleteFile(assets, origin, '.json');
      this.deleteFile(assets, origin, this.postFix.html);
      this.deleteFile(assets, origin, this.postFix.css);
    }
  }

  deleteFile(assets: Record<string, any>, name: string, postfix: string) {
    delete assets[name + postfix];
  }

  addCompChunk(
    assets: Record<string, any>,
    origin: string,
    target: string,
    postfix: string,
    insertCode = '',
  ) {
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
      let source = assets[origin + postfix].source().toString();
      if (postfix === '.js' && !source.startsWith(insertCode)) {
        source = `${insertCode}${source}`;
      }
      updateAssetSource(assets, target + postfix, source);
    }
  }

  modifyRef(assets: Record<string, any>, parsedReplaceRefList: IReplaceRefList) {
    const refMap = formatReplaceRefList(parsedReplaceRefList);
    replaceAllPolyfill();

    for (const key of Object.keys(assets)) {
      const value = assets[key];
      const replaceList = findReplaceMap(key, refMap);

      if (replaceList?.length && (key.endsWith('.js') || key.endsWith('.json'))) {
        let source = value.source().toString();

        for (const replaceItem of replaceList) {
          source = source.replaceAll(`${replaceItem[0]}'`, `${replaceItem[1]}'`);
          source = source.replaceAll(`${replaceItem[0]}"`, `${replaceItem[1]}"`);
          source = source.replaceAll(`${replaceItem[0]}-create-component'`, `${replaceItem[1]}-create-component'`);
          source = source.replaceAll(`${replaceItem[0]}-create-component"`, `${replaceItem[1]}-create-component"`);
        }

        updateAssetSource(assets, key, source);
      }
    }
  }
}

