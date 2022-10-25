import { getVersionCode, getCommitCode } from './helper';

export class GenVersionWebPlugin {
  options: object;

  constructor(options) {
    this.options = options;
  }

  getInsertCode() {
    return `
<script>
try {
  setTimeout(() => {   
    ${getVersionCode()}
    ${getCommitCode()}
  }, 2000);
} catch(err) {}
</script>
`;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('genVersionPlugin', (compilation) => {
      try {
        const { assets } = compilation;
        const key = 'index.html';
        if (!assets[key]) return;

        const source = assets[key].source().toString();
        const insertCode = this.getInsertCode();

        assets[key].source = function () {
          const idx = source.lastIndexOf('</body>');
          return source.slice(0, idx) + insertCode + source.slice(idx);
        };

        assets[key].size = function () {
          return source.length;
        };
      } catch (err) {
        console.log('GenVersionWebPlugin.err: ', err);
      }
    });
  }
}

