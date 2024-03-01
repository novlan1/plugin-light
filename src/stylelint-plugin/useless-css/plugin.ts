
import stylelint from 'stylelint';
import selectorParser from 'postcss-selector-parser';
import { checkCss } from './parse-vue';


const { report, ruleMessages, validateOptions } = stylelint.utils;


const ruleName = 'no-useless-css';
const messages = ruleMessages(ruleName, {
  expected: (selector: string) => `Unexpected ${selector}`,
});


const rule = (primaryOption: any) => function lint(postcssRoot: any, postcssResult: any): any {
  const validOptions = validateOptions(postcssResult, ruleName, {
    actual: primaryOption,
    possible: (option) => {
      if (![null, 'warning', 'error'].includes(option as  any)) {
        return false;
      }
      return true;
    },
  });

  if (!validOptions) {
    return;
  }

  const classList = checkCss(postcssRoot.source.input.file);

  postcssRoot.walkRules((ruleNode: any) => {
    const { selector } = ruleNode;
    selectorParser((nodes) => {
      nodes.walk((node) => {
        if (node.type !== 'class') {
          return;
        }
        const { value } = node;
        if (!classList.includes(value)) {
          report({
            ruleName,
            result: postcssResult,
            message: messages.expected(node.value), // 生成报告的消息
            node: ruleNode, // 指定报告的节点
            word: node.value, // 哪个词导致了错误？这将正确定位错误
            severity: primaryOption,
          });
        }
      });
    }).processSync(selector);
  });
};

rule.ruleName = ruleName;
rule.messages = messages;

export default {
  ruleName,
  messages,
  rule,
};

