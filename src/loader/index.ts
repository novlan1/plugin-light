import * as path from 'path';
import LoaderMap from './config.json';


type ILoaderMap = typeof LoaderMap;


export function getLoaderMap(): ILoaderMap {
  return Object.keys(LoaderMap).reduce((acc: any, key) => {
    acc[key] = path.resolve(__dirname, LoaderMap[key]);
    return acc;
  }, {});
}

export const LOADER_MAP = getLoaderMap();
