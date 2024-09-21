const { execSync } = require('child_process');
const ENV_FILE = '.env.local';

function main() {
  require('dotenv').config({ path: ENV_FILE });

  const sourceDir = 'docs/.vuepress/dist';
  const targetDir = '/root/html/plugin-light';
  const hostName = process.env.HOST_NAME;
  const hostPwd =  process.env.HOST_PWD;

  execSync(`t-comm publish -s ${sourceDir} -t ${targetDir} -n ${hostName} -p ${hostPwd}`, {
    stdio: 'inherit',
  });
}

main();
