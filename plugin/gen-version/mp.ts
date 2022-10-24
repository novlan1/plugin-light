import { getCommitCode, getVersionCode, getMpVersionCode } from './helper';

const insertCode = `
try {
  setTimeout(() => {
    ${getVersionCode()}
    ${getCommitCode()}
    ${getMpVersionCode()}
  }, 2000);
} catch(err) {}
`;


export class GenVersionMpPlugin {
  options: object;
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('genVersionPlugin', (compilation) => {
      try {
        const { assets } = compilation;
        const key = 'app.js';
        if (!assets[key]) return;

        let source = assets[key].source().toString();
        source = `${insertCode}
        ${source}
        `;

        assets[key].source = function () {
          return source;
        };
        assets[key].size = function () {
          return source.length;
        };
      } catch (err) {
        console.log('GenVersionMpPlugin.err: ', err);
      }
    });
  }
}

