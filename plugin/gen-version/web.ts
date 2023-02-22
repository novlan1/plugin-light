import { getVersionCode, getCommitCode } from './helper';
import { updateAssetSource } from '../../helper';

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

        const idx = source.lastIndexOf('</body>');
        const newSource = source.slice(0, idx) + insertCode + source.slice(idx);

        updateAssetSource(assets, key, newSource);
      } catch (err) {
        console.log('[GenVersionMpPlugin] err: ', err);
      }
    });
  }
}

