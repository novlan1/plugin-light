import { localPublish } from 't-comm';
import { PUBLISH_BASE_OPTIONS } from './config-publish';


export function innerPublish(publishEnv) {
  localPublish({
    ...PUBLISH_BASE_OPTIONS,
    publishEnv,
  });
}
