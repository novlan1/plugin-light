import type { IReplaceAppIdOptions } from './types';


function changeAppId({ content, appId }: { content: string; appId: string; }) {
  const reg = /(?<="appid":\s*")(\w+)(?=",)/;
  return content.replace(reg, () => appId);
}

export class ReplaceAppIdPlugin {
  appId: string;

  constructor(options: IReplaceAppIdOptions) {
    const { appId } = options;
    this.appId = appId;
  }

  apply(complier: any) {
    complier.hooks.emit.tapAsync('ReplaceAppIdPlugin', (compilation: any, cb: Function) => {
      try {
        this.doReplace(compilation, cb);
      } catch (err) {
        console.log('[ReplaceAppIdPlugin] err: ', err);
      }
    });
  }

  doReplace(compilation: any, cb: Function) {
    const { appId } = this;
    const { assets } = compilation;
    const key = 'project.config.json';
    const asset = assets[key];

    if (!asset) return;
    if (asset._valueIsBuffer) return;

    const sourceCode = asset.source() || asset._valueAsString || asset._value || asset._cachedSource;

    if (sourceCode != null) {
      asset.source = () => changeAppId({
        content: sourceCode,
        appId,
      });
    }
    cb?.();
  }
}
