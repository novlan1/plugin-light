import type { IRemoveUseRemOptions } from './types';
import { removeUseRemFunction } from './core';
import type { Plugin } from 'vite';

export const removeUseRemVitePlugin: (options?: IRemoveUseRemOptions) => Plugin = (options?: IRemoveUseRemOptions) =>  {
  const { file = /uni-h5\.es\.js/ } = options || {};


  return {
    name: 'vite-plugin-remove-use-rem',
    enforce: 'pre',
    transform(source: string, id: string) {
      if (!file.test(id)) return;

      const result = removeUseRemFunction(source);


      return {
        code: result,
        map: null,
      };
    },
  };
};

