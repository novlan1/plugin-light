import * as path from 'path';
import utils from 'loader-utils';
import preprocessor from './preprocess/preprocess';


const ERRORS = {
  html: `条件编译失败,参考示例(注意 ifdef 与 endif 必须配对使用):
<!--  #ifdef  %PLATFORM% -->
模板代码
<!--  #endif -->
`,
  js: `条件编译失败,参考示例(注意 ifdef 与 endif 必须配对使用):
// #ifdef  %PLATFORM%
js代码
// #endif
`,
  css: `条件编译失败,参考示例(注意 ifdef 与 endif 必须配对使用):
/*  #ifdef  %PLATFORM%  */
css代码
/*  #endif  */
`,
};

const TAGS = {
  html: 'template',
  js: 'script',
  css: 'style',
};

export default function preprocessLoader(content = '') {
  if (content.indexOf('#ifdef') < 0 && content.indexOf('#ifndef') < 0) {
    return content;
  }

  // @ts-ignore
  const { type, context = {} } = utils.getOptions(this);
  let types = type;


  if (!Array.isArray(types)) {
    types = [types];
  }

  // @ts-ignore
  const { resourcePath } = this;
  console.log('[ifdef-loader]正在处理: ', resourcePath);

  types.forEach((type) => {
    try {
      content = preprocessor.preprocess(content, context, {
        type,
      });
    } catch (e) {
      if (~['.nvue', '.vue'].indexOf(path.extname(resourcePath))) {
        console.error(`${TAGS[type]}节点 ${ERRORS[type]}`);
      } else {
        console.error(`${ERRORS[type]}`);
      }
    }
  });
  return content;
}
