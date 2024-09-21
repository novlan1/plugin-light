const path = require('path');
const { genVersionTip, batchSendWxRobotMarkdown  } = require('t-comm');

function sendVersionTip(pkgName) {
  const webhookUrl = 'COMMON_ROBOT___407e108c-ab38-4a2b-9e83-6580de69f0d7';
  // const webhookUrl = '93aaa83a-e11a-4b27-af7c-5a44d611a069';
  console.log('webhookUrl: ', webhookUrl);

  const content = genVersionTip({
    appInfo: require(`../../packages/${pkgName}/package.json`),
    showNpmLink: false,
    readmeFilePath: path.resolve(__dirname, `../../packages/${pkgName}/CHANGELOG.md`),
  });

  console.log('content:\n', content);

  batchSendWxRobotMarkdown({
    content,
    chatId: 'ALL',
    webhookUrl,
  });
}

module.exports = {
  sendVersionTip,
};

