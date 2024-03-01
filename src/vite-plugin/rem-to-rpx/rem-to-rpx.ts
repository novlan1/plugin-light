import { handleRem } from '../../webpack-plugin/rem-to-rpx/css-handler';
const FILE_POSTFIXES = [
  'css',
  'scss',
];

function shouldHandleFile(file: string) {
  let fileName = file;
  let postfix = '';
  const index = file.indexOf('?');

  if (index > -1) {
    fileName = file.slice(0, index);
    postfix = file.slice(index);
  }

  const reg = new RegExp(`\\.${FILE_POSTFIXES.join('|')}`);
  if (reg.test(fileName)) {
    return true;
  }

  if (fileName.endsWith('.vue') && postfix.indexOf('type=style') > -1) {
    return true;
  }
  return false;
}


export function remToRpxVitePlugin() {
  return {
    name: 'rem-to-rpx',
    // enforce: 'post',
    transform(source: string, id: string) {
      if (!shouldHandleFile(id)) return;

      return {
        code: handleRem(source),
        map: null,
      };
    },
  };
}
