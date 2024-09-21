import * as path from 'path';
import * as fs from 'fs';
import { readEnvVariable } from 't-comm';
import { getRootDir } from '../../root';


function getAppDir() {
  if (process.env.VUE_APP_DIR) {
    return process.env.VUE_APP_DIR;
  }
  if (process.env.UNI_INPUT_DIR) {
    return process.env.UNI_INPUT_DIR;
  }

  const dir = readEnvVariable('VUE_APP_DIR', path.join(getRootDir(), '.env.local'));
  if (dir) {
    return dir;
  }
  return '';
}

export function getStyleName() {
  const configPath = path.resolve(getRootDir(), 'src', getAppDir(), 'config.js');

  let config = { styleName: '' };
  if (fs.existsSync(configPath)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    config = require(configPath);
  }

  const { styleName } = config;
  return styleName;
}
