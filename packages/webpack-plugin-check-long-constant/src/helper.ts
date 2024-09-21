import { saveJsonToLog } from 'plugin-light-shared';
import type { FoundItem } from './types';


const LOG_FILE_NAME = 'long-constant.result';
const THRESHOLD_LIST = [100, 300, 500, 1000, 2000];


export function saveData(rawData: Array<{
  file: string,
  data: Array<FoundItem>
}>) {
  for (const threshold of THRESHOLD_LIST) {
    const result = filterData(rawData, threshold);
    saveJsonToLog(result, `${LOG_FILE_NAME}-${threshold}.json`);
  }
}


function filterData(rawData: Array<{
  file: string,
  data: Array<FoundItem>
}>, threshold: number) {
  return rawData.map((item) => {
    const { data, file } = item;

    const temp = data.map(item => ({
      ...item,
      length: item.value.length,
    })).filter(it => it.length > threshold);

    return {
      file,
      data: temp,
    };
  }).filter(item => item.data.length);
}
