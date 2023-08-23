const path = require('path');
const { writeEnvFromRainbow } = require('t-comm');

const envPath = path.resolve(__dirname, '../../.env.local');

async function main() {
  await writeEnvFromRainbow({
    envPath,
    rainbowKey: 'uni_plugin_light_env',
    envName: 'Default',
    groupName: 'devops',
  });
}

main();
