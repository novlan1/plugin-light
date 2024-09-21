import { getRollupConfig } from '../../script/build/rollup.config';

export default getRollupConfig(__dirname, [
  'vue-template-compiler',
]);
