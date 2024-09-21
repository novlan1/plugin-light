import { getRollupConfig } from '../../script/build/rollup.config';

export default getRollupConfig(__dirname, [
  'unplugin-vue-components/vite',
  'unplugin-vue-components/resolvers',
  'unplugin-auto-import/vite',
]);

