import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as parser from '@babel/parser';
import * as t from '@babel/types';


export function removeUseRemFunction(source: string) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['typescript'],
  });


  traverse(ast, {
    FunctionDeclaration(path) {
      if (path?.node?.id?.name !== 'useRem') {
        return;
      }
      if (!path?.node?.body?.body?.length) {
        return;
      }

      const emptyUseRem = t.functionDeclaration(t.identifier('useRem'), [], t.blockStatement([]), false, false);
      path.insertBefore(emptyUseRem);
      path.remove();
    },
  });

  const result = generate(ast, {});

  return result.code;
}
