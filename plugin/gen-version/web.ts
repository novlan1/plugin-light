import { getVersionCode, getCommitCode } from './helper';
import { updateAssetSource } from '../../helper';

export class GenVersionWebPlugin {
  options: object;
  buildName?: string;
  commitName?: string;
  delay: number;

  constructor(options: Record<string, any> = {}) {
    this.options = options || {};
    this.buildName = options.buildName || '';
    this.commitName = options.commitName || '';
    this.delay = options.delay || 10;
  }

  getInsertCode() {
    return `
<script>
try {
  setTimeout(() => {   
    ${getVersionCode(this.buildName)}
    ${getCommitCode(this.commitName)}
  }, ${this.delay});
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
