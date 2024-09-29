import { localPublish } from 't-comm';
import { DEFAULT_PUBLISH_OPTIONS } from './config';


export function innerPublish({
  publishEnv,
  host,
  port = DEFAULT_PUBLISH_OPTIONS.port,
  method = DEFAULT_PUBLISH_OPTIONS.method,
  path = DEFAULT_PUBLISH_OPTIONS.path,
}: {
  publishEnv: string;
  host: string;
  port?: string;
  method?: string;
  path?: string;
}) {
  if (!host && publishEnv !== 'devcloud') {
    console.log('请从环境变量注入 `host`，如 process.env.VUE_APP_LOCAL_PUBLISH_HOST');
    return;
  }
  localPublish({
    host,
    port,
    method,
    path,
    publishEnv,
  } as any);
}
