import fs from 'fs';
import path from 'path';
import  stripJsonComments from 'strip-json-comments';


function getJson(jsonFileName: string, preprocess = false) {
  const jsonFilePath = path.resolve(process.env.UNI_INPUT_DIR || '', jsonFileName);

  if (!fs.existsSync(jsonFilePath)) {
    throw new Error(`${jsonFileName} Not Exist`);
  }
  try {
    return parseJson(fs.readFileSync(jsonFilePath, 'utf8'), preprocess);
  } catch (e) {
    throw new Error(`${jsonFileName} Parse Error`);
  }
}

function parseJson(content: string, preprocess = false) {
  if (typeof content === 'string') {
    if (preprocess) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const preprocessor = require('@press-plus/lib/loader/ifdef-loader.js');

      content = preprocessor.preprocess(content, {}, {
        type: 'js',
      });
    }
    content = JSON.parse(stripJsonComments(content));
  }

  content = JSON.stringify(content)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return JSON.parse(content);
}


export function getPagesJon() {
  const result = getJson('pages.json', true);
  return result;
}

