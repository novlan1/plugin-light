import stylelint from 'stylelint';
import { uselessCssPlugin } from './useless-css/index';

const nameSpace = (ruleName: string) => `stylelint-plugin/${ruleName}`;

const RULES = [
  uselessCssPlugin,
].map(item => stylelint.createPlugin(nameSpace(item.ruleName), item.rule));

export default RULES;
