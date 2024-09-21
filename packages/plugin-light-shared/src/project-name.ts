import { readFileSync } from 't-comm';


export function getProjectName() {
  let result = '';

  try {
    const json = readFileSync('package.json', true) || {};
    result = json.name || '';
  } catch (err) {}

  return result;
}


export function getSubProjectName() {
  const name = process.env.VUE_APP_DIR?.split('/')?.[1] || '';
  return name;
}
