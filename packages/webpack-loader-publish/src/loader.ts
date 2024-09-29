import { innerPublish } from './publish-inner';
import { DEFAULT_PUBLISH_OPTIONS } from './config';


function getPublishEnv() {
  const args = process.argv.slice(2);
  const publishEnv = args[0];
  return publishEnv;
}

export default function main() {
  innerPublish({
    publishEnv: getPublishEnv(),
    host: process.env.VUE_APP_LOCAL_PUBLISH_HOST || '',

    port: process.env.VUE_APP_LOCAL_PUBLISH_PORT || DEFAULT_PUBLISH_OPTIONS.port,
    method: process.env.VUE_APP_LOCAL_PUBLISH_METHOD || DEFAULT_PUBLISH_OPTIONS.method,
    path: process.env.VUE_APP_LOCAL_PUBLISH_PATH || DEFAULT_PUBLISH_OPTIONS.path,
  });
}

main();
