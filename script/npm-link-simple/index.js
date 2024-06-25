const { execCommand } = require('t-comm');
const { LINK_CONFIG } = require('./config');


function main() {
  const { target, npmList, npmRoot } = LINK_CONFIG;
  npmList.forEach((npm) => {
    const targetLib = `${target}/node_modules/${npm}/lib`;
    const toDeleteTarget =  `${targetLib}/*`;

    const command = `rm -rf ${toDeleteTarget}`;
    console.log('[DELETE]', command);
    execCommand(command);

    const commandCP = `cp -r ${npmRoot}/* ${targetLib}`;
    console.log('[CP]', commandCP);
    execCommand(commandCP);
  });
}

main();
