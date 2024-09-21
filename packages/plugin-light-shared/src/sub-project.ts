import path from 'path';


export function getSubProjectRoot({
  root,
  appDir,
}: {
  root: string;
  appDir: string;
}) {
  let subProjectRoot = `${path.resolve(root, `./src/${appDir}`)}/`;
  if (!appDir) {
    subProjectRoot = path.resolve(root, './src/');
  }

  return subProjectRoot;
}

export function getSubProjectConfig(subProjectRoot: string) {
  let res: Record<string, any> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    res = require(path.resolve(subProjectRoot, 'config.js'));
  } catch (err) {}
  return res;
}
