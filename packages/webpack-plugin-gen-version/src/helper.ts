// import { getGitCommitInfo, timeStampFormat, getGitCurBranch, getGitAuthor } from 't-comm';
// import type { IGenVersionOptions } from './types';

// function parseQuote(str = '') {
//   return str.replace(/'/g, '"');
// }

// export function getVersionCode(versionName?: string) {
//   let author = '';
//   let branch = '';

//   try {
//     author = getGitAuthor(false) || '';
//     branch = getGitCurBranch() || '';
//   } catch (err) {}

//   const versionInfo = {
//     time: timeStampFormat(Date.now(), 'yyyy-MM-dd hh:mm:ss'),
//     author,
//     branch,
//     netEnv: process.env.NET_ENV || '',
//   };

//   let code = '';
//   if (versionName) {
//     code = `
// window.${versionName} = {
//   time: '${versionInfo.time}',
//   author: '${versionInfo.author}',
//   branch: '${versionInfo.branch}',
//   netEnv: '${versionInfo.netEnv}',
// }
//     `;

//     return code;
//   }

//   code = `
// console.info('[system]', '');
// console.info('[system]', 'Build Time: ${versionInfo.time || ''}');
// console.info('[system]', 'Build Author: ${versionInfo.author || ''}');
// console.info('[system]', 'Build Branch: ${versionInfo.branch || ''}');
// console.info('[system]', 'Build Net Env: ${versionInfo.netEnv || ''}');
// `;

//   return code;
// }


// export function getCommitCode(versionName?: string) {
//   let commitInfo: any = {};
//   try {
//     commitInfo = getGitCommitInfo();
//   } catch (err) {}
//   if (commitInfo.timeStamp) {
//     commitInfo.date = timeStampFormat(commitInfo.timeStamp, 'yyyy-MM-dd hh:mm:ss');
//   }


//   let code = '';
//   if (versionName) {
//     code = `
// window.${versionName} = {
//   message: '${commitInfo.message}',
//   author: '${commitInfo.author}',
//   date: '${commitInfo.date}',
//   hash: '${commitInfo.hash}',
// }
//     `;

//     return code;
//   }

//   code = `
// console.info('[system]', '');
// console.info('[system]', 'Last Commit Message: ${parseQuote(commitInfo.message) || ''}');
// console.info('[system]', 'Last Commit Author: ${commitInfo.author || ''}');
// console.info('[system]', 'Last Commit Time: ${commitInfo.date || ''}');
// console.info('[system]', 'Last Commit Hash: ${commitInfo.hash || ''}');
//   `;
//   return code;
// }


// export function getMpVersionCode() {
//   return `
// var uni = (typeof wx !== 'undefined' && wx)
//   || (typeof qq !== 'undefined' && qq)
//   || (typeof jd !== 'undefined' && jd)
//   || (typeof my !== 'undefined' && my);

// var miniProgram = uni.getAccountInfoSync().miniProgram || {};
// var systemInfo = uni.getSystemInfoSync() || {};
// var envVersionMap = {
//   develop: '开发版',
//   trial: '体验版',
//   release: '正式版'
// }
// var { envVersion = '', version = '' } = miniProgram;
// var { brand, model, pixelRatio } = systemInfo;
// var versionDesc = \`\${envVersion}(\${envVersionMap[envVersion] || ''})\`;

// console.info('[system]', '');
// console.info('[system]', \`Env Version：\${envVersion ? versionDesc : ''}\`);
// console.info('[system]', \`Version：\${version}\`);

// console.info('[system]', '');
// console.info('[system]', \`Brand：\${brand}, \${model}\`);
// console.info('[system]', \`PixelRatio：\${pixelRatio}\`);
//   `;
// }


// export function getMpInsertCode() {
//   const insertCode = `
// try {
//   setTimeout(() => {
//     ${getVersionCode()}
//     ${getCommitCode()}
//     ${getMpVersionCode()}
//   }, 2000);
// } catch(err) {}
// `;

//   return insertCode;
// }


// export function getGenVersionPluginOptions(options: IGenVersionOptions) {
//   const buildName = options?.buildName || '';
//   const commitName = options?.commitName || '';
//   const delay = options?.delay === undefined ? 10 : options?.delay;

//   return {
//     buildName,
//     commitName,
//     delay,
//   };
// }


// export function getWebInsertCode(options: IGenVersionOptions) {
//   const { buildName, commitName, delay } = getGenVersionPluginOptions(options || {});

//   return `
// <script>
// try {
//   setTimeout(() => {
//     ${getVersionCode(buildName)}
//     ${getCommitCode(commitName)}
//   }, ${delay});
// } catch(err) {}
// </script>
// `;
// }
