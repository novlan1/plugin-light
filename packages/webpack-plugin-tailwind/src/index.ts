import { updateAssetSource, getPlatform } from '@plugin-light/shared';
import { isStyleFile, transformStyle } from './style';
import { isTemplateFile, transformTemplate } from './template';
import {
  type UniTailwindPluginOptions,
  type UniTailwindPluginUserOptions,
  defaultOptions,
} from './options';


const PLUGIN_NAME = 'tailwindWebpackPlugin';

export class TailwindPlugin {
  options;
  constructor(userOptions?: UniTailwindPluginUserOptions) {
    const options: UniTailwindPluginOptions = {
      characterMap: userOptions?.characterMap ?? defaultOptions.characterMap,
      directChildrenElements:
        userOptions?.directChildrenElements
        ?? defaultOptions.directChildrenElements,
      divideWidthElements:
        userOptions?.divideWidthElements ?? defaultOptions.divideWidthElements,
      elementMap: userOptions?.elementMap ?? defaultOptions.elementMap,
      shouldApply:
        // eslint-disable-next-line no-nested-ternary
        userOptions?.shouldApply === undefined
          ? defaultOptions.shouldApply
          : typeof userOptions?.shouldApply === 'boolean'
            ? userOptions.shouldApply
            : userOptions.shouldApply(getPlatform()),
      shouldTransformAttribute:
        userOptions?.shouldTransformAttribute
        ?? defaultOptions.shouldTransformAttribute,
      shouldTransformScript:
        userOptions?.shouldTransformScript
        ?? defaultOptions.shouldTransformScript,
      spaceBetweenElements:
        userOptions?.spaceBetweenElements ?? defaultOptions.spaceBetweenElements,
    };

    this.options = options;
  }


  apply(compiler: any) {
    const { options } = this;

    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation: any) => {
      const { assets } = compilation;
      Object.keys(assets).map((file) => {
        const source = assets[file].source().toString();
        let newSource = '';

        if (isStyleFile(file)) {
          newSource = transformStyle(source, options);
        } else if (isTemplateFile(file)) {
          newSource = transformTemplate(source, options);
        }
        if (newSource && source !== newSource) {
          updateAssetSource(assets, file, newSource);
          console.log(`>>> 已经处理 ${file}`);
        }
      });
    });
  }
}
