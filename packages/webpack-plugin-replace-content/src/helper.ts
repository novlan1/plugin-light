import { isRegExp } from 't-comm';
import type { IReplaceList } from './types';


function isInTarget(files: Array<string | RegExp> = [], current: string) {
  return !!files.find((item) => {
    if (isRegExp(item)) {
      return (item as RegExp).test(current);
    }
    return (item as string).indexOf(current) > -1;
  });
}

export function replaceSource({
  source,
  replaceList,
  file,
}: {
  source: string;
  replaceList: IReplaceList;
  file: string;
}) {
  let result = source;

  for (const item of replaceList) {
    const { from, to, files = [] } = item;

    if (!isInTarget(files, file)) {
      continue;
    }

    if (isRegExp(from)) {
      result = result.replace(from, to);
    } else {
      result = result.replaceAll(from, to);
    }
  }
  return result;
}
