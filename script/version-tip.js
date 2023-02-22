const { genVersionTip, batchSendWxRobotMarkdown  } = require('t-comm');
const pkg = require('../package.json');

function main() {
  const webhookUrl = 'COMMON_ROBOT___407e108c-ab38-4a2b-9e83-6580de69f0d7';
  console.log('webhookUrl: ', webhookUrl);

  const content = genVersionTip({
    appInfo: pkg,
    showNpmLink: false,
    readmeFilePath: './CHANGELOG.md',
  });

  console.log('content:\n', content);

  batchSendWxRobotMarkdown({
    content,
    chatId: 'ALL',
    webhookUrl,
  });
}

main();
