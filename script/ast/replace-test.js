const fs = require('fs');
const { replaceDependencies, parseReplaceConfig } = require('t-comm/lib/ast');
const { REPLACE_CONFIG } = require('./config');


const source = `
import { wzryGameRoomHelper } from 'src/common/tools/wzry-game-room';
`;

const newConfig = REPLACE_CONFIG.map((item) => {
  const newSource = Array.isArray(item.source) ? item.source : [item.source];
  newSource.push('src/common');

  return {
    ...item,
    source: newSource,
  };
});


function main() {
  const parsedConfigList = parseReplaceConfig(newConfig);
  const output = replaceDependencies(source, parsedConfigList);

  console.log('output\n', output);

  fs.writeFileSync('./log/ast.ts', output, {
    encoding: 'utf-8',
  });
}


main();

