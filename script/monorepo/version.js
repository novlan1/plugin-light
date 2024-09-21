const semver = require('semver');
const { prompt } = require('enquirer');
const glob = require('glob');
const { execCommand, writeFileSync, readFileSync } = require('t-comm');
const { parseArgs } = require('node:util');


const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  // args: ['--bar'],
  options: {
    package: {
      type: 'string',
    },
    build: {
      type: 'boolean',
      default: false,
    },
    publish: {
      type: 'boolean',
      default: false,
    },
  },
});

console.log('args', args, args.publish, positionals);

const PACKAGE_MAP = {
  webpackLoader: 'webpack-loader-*',
  webpackPlugin: 'webpack-plugin-*',
  vitePlugin: 'vite-plugin-*',
  projectConfig: 'project-config-*',
};


async function getPackages() {
  const { packages } = await prompt({
    type: 'select',
    name: 'packages',
    message: 'Select packages type',
    choices: Object.keys(PACKAGE_MAP).map(item => ({
      name: PACKAGE_MAP[item],
      message: PACKAGE_MAP[item],
    })),
  });

  console.log('[packages]', packages);
  const list = glob.sync(`./packages/${packages}/`);
  console.log('[list]', list);
  console.log('[list length]', list.length);

  return list;
}


async function genVersion() {
  const { version } = await prompt({
    type: 'select',
    name: 'version',
    message: 'Select release type',
    choices: [
      'major',
      'minor',
      'patch',
    ],
  });
  console.log('[version]', version);
  return version;
}


async function upgradeVersion(pkg, version) {
  const file = `${pkg}/package.json`;
  const json = readFileSync(file, true);
  const newVersion = semver.inc(json.version, version);
  json.version = newVersion;
  console.log(`[newVersion] ${pkg} ${newVersion}`);
  writeFileSync(file, json, true);
}

async function  publishPackages(pkg) {
  if (args.build) {
    execCommand(`pnpm --filter="./${pkg}" build`, process.cwd(), 'inherit');
  }
  if (args.publish) {
    execCommand(`pnpm --filter="./${pkg}" publish --no-git-checks`, process.cwd(), 'inherit');
  }
}

function getPackagesFromArgs(pkg) {
  if (Object.values(PACKAGE_MAP).includes(pkg)) {
    return glob.sync(`./packages/${pkg}/`);
  }
  return [pkg];
}

async function main() {
  const result = semver.inc('0.0.6', 'patch');
  console.log('result', result);

  let targetPackages = args.package ? getPackagesFromArgs(args.package) : undefined;

  if (!targetPackages) {
    targetPackages = await getPackages();
  }


  let version = positionals[0];
  if (!version) {
    version = await genVersion();
  }

  targetPackages.forEach((pkg) => {
    upgradeVersion(pkg, version);

    publishPackages(pkg);
  });
}


main();
