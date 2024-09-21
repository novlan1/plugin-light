import path from 'path';
import { writeFileSync } from 't-comm';

let localData = {};


export function genMpQQAppIdVitePlugin() {
  return {
    name: 'gen-mp-qq-app-id',
    writeBundle: (options: any, bundle: any) => {
      const output = process.env.UNI_OUTPUT_DIR;
      const target = path.resolve(output || '', 'project.config.json');
      const projectConfigJsonBundle = bundle['project.config.json'];

      let projectConfigJson: Record<string, any> = {};
      try {
        projectConfigJson = JSON.parse(projectConfigJsonBundle.source);
      } catch (err) {
        projectConfigJson = {};
      }

      if (projectConfigJson.qqappid) {
        localData = projectConfigJson;
      }

      if (localData) {
        console.log('[genMpQQAppIdVitePlugin]', projectConfigJson.qqappid);
        writeFileSync(target, {
          ...localData,
        }, true);
      }
    },
  };
}
