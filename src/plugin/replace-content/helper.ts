import { isRegExp } from 't-comm';

function isInTarget(files, current) {
  return !!files.find((item) => {
    if (isRegExp(item)) {
      return item.test(current);
    }
    return item.indexOf(item) > -1;
  });
}

export function replaceSource({
  source,
  replaceList,
  file,
}) {
  let result = source;

  for (const item of replaceList) {
    const { from, to, files } = item;

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
