import type { IInsertGlobalCompOptions } from './types';

function getGlobalComponents(assets: any, options: IInsertGlobalCompOptions) {
  const app = assets['app.json'];
  let result = {};
  const { namespace } = options;
  if (!app) {
    return result;
  }

  try {
    const sourceCode = app.source();
    const sourceObj = JSON.parse(sourceCode);
    result = sourceObj.usingComponents || {};
  } catch (err) {
    result = {};
  }
  return parseGlobalComponents(result, namespace);
}

function parseGlobalComponents(obj: Record<string, any>, namespace?: string) {
  if (!namespace) {
    return obj;
  }
  return Object.keys(obj).reduce((acc: any, item: string) => {
    const origin = obj[item];
    const result = `/${namespace}${origin.slice(0)}`;
    acc[item] = result;
    return acc;
  }, {});
}


function addComponentsForJson(json: Record<string, any>, globalComponents: Record<string, string>) {
  json.usingComponents = {
    ...(json.usingComponents || {}),
    ...globalComponents,
  };

  return json;
}

export class InsertGlobalCompPlugin {
  options: IInsertGlobalCompOptions;

  constructor(options: IInsertGlobalCompOptions) {
    this.options = options;
  }

  apply(compiler: any) {
    if (process.env.UNI_PLATFORM !== 'mp-weixin' && process.env.UNI_PLATFORM !== 'mp-qq') return;

    compiler.hooks.emit.tap('InsertGlobalCompPlugin', (compilation: any) => {
      const { assets } = compilation;
      const fileNames = Object.keys(assets);
      const globalComponents = getGlobalComponents(assets, this.options);


      console.log('[globalComponents]', globalComponents);
      for (const fileName of fileNames) {
        if (/\.(json)$/.test(fileName) === false || fileName === 'app.json') {
          continue;
        }

        const asset = compilation.assets[fileName];
        if (asset._valueIsBuffer) {
          continue;
        }


        const sourceCode = asset.source();
        let sourceObj = {};
        try {
          sourceObj = JSON.parse(sourceCode);
        } catch (err) {}

        if (!sourceObj || !Object.keys(sourceObj).length) {
          continue;
        }

        addComponentsForJson(sourceObj, globalComponents);
        asset.source = () => JSON.stringify(sourceObj, null, 2);
      }
    });
  }
}

