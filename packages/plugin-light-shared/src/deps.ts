import path from 'path';
import { readFileSync } from 't-comm';

export function getDeps(dir: string) {
  const data = readFileSync(path.resolve(dir, 'package.json'), true);

  return Object.keys({
    ...data.dependencies,
  });
}
