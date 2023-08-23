import { innerPublish } from './publish-inner';

function getPublishEnv() {
  const args = process.argv.slice(2);
  const publishEnv = args[0];
  return publishEnv;
}

function main() {
  innerPublish(getPublishEnv());
}

main();
