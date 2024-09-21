import { localPublish } from 't-comm';
import { PUBLISH_BASE_OPTIONS } from './config-publish';


export function innerPublish(publishEnv: string) {
  localPublish({
    ...PUBLISH_BASE_OPTIONS,
    publishEnv,
  } as any);
}
