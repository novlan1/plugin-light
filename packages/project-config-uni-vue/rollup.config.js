import { getRollupConfig } from '../../script/build/rollup.config';

export default getRollupConfig(__dirname, [
  't-comm/lib/v-console/config',
]);
