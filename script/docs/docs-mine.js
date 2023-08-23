const { execSync } = require('child_process');
const ENV_FILE = '.env.local';

function main() {
  require('dotenv').config({ path: ENV_FILE });

  const token = process.env.GITHUB_TOKEN;

  execSync(`sh script/docs/docs-mine.sh ${token}`, {
    stdio: 'inherit',
  });
}

main();
