import { getGitCommitInfo, timeStampFormat, getGitCurBranch, getGitAuthor } from 't-comm';

export function getVersionCode() {
  let author = '';
  let branch = '';

  try {
    author = getGitAuthor(false);
    branch = getGitCurBranch();
  } catch (err) {}

  const versionInfo = {
    time: timeStampFormat(Date.now(), 'yyyy-MM-dd hh:mm:ss'),
    author,
    branch,
    netEnv: process.env.NET_ENV,
  };


  const code = `
console.info('[system]', '');
console.info('[system]', 'Build Time: ${versionInfo.time || ''}');
console.info('[system]', 'Build Author: ${versionInfo.author || ''}');
console.info('[system]', 'Build Branch: ${versionInfo.branch || ''}');
console.info('[system]', 'Build Net Env: ${versionInfo.netEnv || ''}');
`;
  return code;
}


export function getCommitCode() {
  let commitInfo: any = {};
  try {
    commitInfo = getGitCommitInfo();
  } catch (err) {}
  if (commitInfo.timeStamp) {
    commitInfo.date = timeStampFormat(commitInfo.timeStamp, 'yyyy-MM-dd hh:mm:ss');
  }


  const code = `
console.info('[system]', '');
console.info('[system]', 'Last Commit Message: ${commitInfo.message || ''}');
console.info('[system]', 'Last Commit Author: ${commitInfo.author || ''}');
console.info('[system]', 'Last Commit Time: ${commitInfo.date || ''}');
console.info('[system]', 'Last Commit Hash: ${commitInfo.hash || ''}');
  `;
  return code;
}


export function getMpVersionCode() {
  return `
var miniProgram = wx.getAccountInfoSync().miniProgram || {};
var systemInfo = wx.getSystemInfoSync() || {};
var envVersionMap = {
  develop: '开发版',
  trial: '体验版',
  release: '正式版'
}
var { envVersion, version } = miniProgram;
var { brand, model, pixelRatio } = systemInfo;
var versionDesc = \`\${envVersion}(\${envVersionMap[envVersion]})\`;

console.info('[system]', '');
console.info('[system]', \`Env Version：\${versionDesc}\`);
console.info('[system]', \`Version：\${version}\`);

console.info('[system]', '');
console.info('[system]', \`Brand：\${brand}, \${model}\`);
console.info('[system]', \`PixelRatio：\${pixelRatio}\`);
  `;
}

