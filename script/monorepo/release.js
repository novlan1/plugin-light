const path = require('path');
const { execCommand, readFileSync } = require('t-comm');
const { sendVersionTip } = require('./version-tip');

const PACKAGES_PATH = path.resolve(__dirname, '../../packages');
const pwd = process.argv[2];
if (!pwd) {
  throw new Error('缺少包路径');
}

const version = process.argv[3] || 'patch';
const needVersionTip = process.argv.includes('needVersionTip');
console.log(`[release] needVersionTip is ${needVersionTip}`);


function packageBuild(pkgName) {
  execCommand(`pnpm --filter=${pkgName} build`, process.cwd(), 'inherit');
}

function bumpVersion(pwd) {
  console.log(`[release] origin version is ${version}`);
  execCommand(`npm version ${version}`, pwd, 'inherit');
}


function getPkgName(pwd) {
  return pwd.replace(/^.*?([\w-]+)$/, '$1');
}


function doChangeLog(pwd, pkgName) {
  console.log(`[release] pkg name is ${pkgName}`);
  execCommand(`conventional-changelog -i CHANGELOG.md -s --commit-path . --lerna-package ${pkgName}`, pwd, 'inherit');
}

function genTag(pkgName, newVersion) {
  console.log('[release] new version is ', newVersion);
  execCommand(`git tag ${pkgName}@${newVersion}`, process.cwd(), 'inherit');
}


function getNewVersion(pkgName) {
  const jsonFile = path.resolve(PACKAGES_PATH, pkgName, './package.json');
  const { version } = readFileSync(jsonFile, true);

  return version;
}

function commit(newVersion) {
  execCommand('git add ./CHANGELOG.md ./package.json', pwd, 'inherit');
  execCommand(`git commit -m"chore(release): ${newVersion}" --no-verify`, pwd, 'inherit');
}

function publish(pkgName) {
  execCommand(`pnpm --filter=${pkgName} publish --no-git-checks`, process.cwd(), 'inherit');
  execCommand('git push origin master', undefined, 'inherit');
  execCommand('git push --tags', undefined, 'inherit');
}

/**
 * a. Make changes
 * b. Commit those changes
 *
 *
 * 1. Bump version in package.json
 * 2. conventionalChangelog
 * 3. Commit package.json and CHANGELOG.md files
 * 4. Tag
 * 5. Push, Publish
 */
function main() {
  const pkgName = getPkgName(pwd);
  if (!pkgName) {
    throw new Error('缺少包名称');
  }
  packageBuild(pkgName);

  bumpVersion(pwd);
  doChangeLog(pwd, pkgName);

  const newVersion = getNewVersion(pkgName);

  commit(newVersion);
  genTag(pkgName, newVersion);
  publish(pkgName);

  if (needVersionTip) {
    sendVersionTip(pkgName);
  }
}


main();
