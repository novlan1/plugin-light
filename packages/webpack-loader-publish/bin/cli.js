#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');
const { innerPublish } = require('../lib/index');

const VALID_ENV_LIST = ['test', 'prod', 'devcloud'];

program
  .name('light-cli')
  .description('CLI for plugin-light')
  .version(version);


program.command('publish')
  .description('Publish to server with bash script')
  .option('-e, --env <string>', 'publish environment')
  .action((options) => {
    const { env = 'test' } = options;
    console.log('[env] ', env);

    if (VALID_ENV_LIST.indexOf(env) === -1) {
      console.error('[publish] failed. env 参数不合法，请检查！');
      return;
    }

    innerPublish({
      publishEnv: env,
    });
  });

program.parse();


