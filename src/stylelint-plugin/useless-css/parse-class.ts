import { readFileSync } from 't-comm';

const htmlClassReg = /class="([^"]+)"/g;


function getHtmlClasses(file: string) {
  const content = readFileSync(file);
  const result = [];

  let match = htmlClassReg.exec(content);
  while (match) {
    result.push(parseVariableClass(match[1]));
    match = htmlClassReg.exec(content);
  }

  const flattened =  result.reduce((acc: Array<string>, item) => {
    const list = item.split(' ');
    acc.push(...list);
    return acc;
  }, [])
    .map((item: string) => filterSymbols(item))
    .filter((item: string) => item);

  return flattened;
}


function filterSymbols(name: string) {
  const reg = /[:'"{[\]},]/g;
  return name.replace(reg, '').replace('\n', '');
}


function parseVariableClass(name: string) {
  if (!name.includes('{{')) {
    return name;
  }
  const pure = name.replace(/^\{\{\[(.*)\]\}\}$/, '$1');
  const list = pure.split(',');

  const newList = list.reduce((acc: Array<string>, item) => {
    acc.push(...parseQuestionClass(item));
    return acc;
  }, []);

  return newList.join(' ');
}

function parseQuestionClass(name: string) {
  name = name.replace(/^'(.*?)'$/g, '$1');
  if (!name.includes('?')) {
    return [name];
  }
  const reg = /\?'([^']*)':'([^']*)'/;

  const match = name.match(reg);
  if (!match) {
    return [];
  }
  return [
    match[1],
    match[2],
  ].filter(item => item);
}

export {
  getHtmlClasses,
};
