import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_KEY_MAP } from './config';


export function getRoot() {
  const root = process.cwd();
  return root;
}

export function getConfig() {
  const root = getRoot();
  let pkg = {};

  const configFile = path.resolve(root, CONFIG_KEY_MAP.FILE);
  if (fs.existsSync(configFile)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(configFile)?.[CONFIG_KEY_MAP.SYNC_REPO] || {};
  }

  try {
    const content = fs.readFileSync(path.resolve(root, 'package.json'), {
      encoding: 'utf-8',
    });
    pkg = JSON.parse(content);
  } catch (err) {}

  return pkg?.[CONFIG_KEY_MAP.LIGHT_CLI]?.[CONFIG_KEY_MAP.SYNC_REPO] || {};
}
