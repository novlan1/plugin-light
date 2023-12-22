// 读取 manifest.json ，修改后重新写入
import * as fs from 'fs';
const manifestPath = `${process.env.UNI_INPUT_DIR}/manifest.json`;
const originManifest = fs.readFileSync(manifestPath, { encoding: 'utf-8' });

let Manifest = originManifest;


function replaceManifest(path, value) {
  const arr = path.split('.');
  const len = arr.length;
  const lastItem = arr[len - 1];

  let i = 0;
  const ManifestArr = Manifest.split(/\n/);

  for (let index = 0; index < ManifestArr.length; index++) {
    const item = ManifestArr[index];
    if (new RegExp(`"${arr[i]}"`).test(item)) i = i + 1;
    if (i === len) {
      const hasComma = /,/.test(item);
      ManifestArr[index] = item.replace(new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`), `"${lastItem}": ${value}${hasComma ? ',' : ''}`);
      break;
    }
  }

  Manifest = ManifestArr.join('\n');
}

export function updateManifest(path, value) {
  replaceManifest(path, value);
  fs.writeFileSync(manifestPath, Manifest, {
    flag: 'w',
  });
}

export function revertManifest() {
  fs.writeFileSync(manifestPath, originManifest, {
    flag: 'w',
  });
}

