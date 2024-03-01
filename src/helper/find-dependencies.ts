/* eslint-disable @typescript-eslint/no-require-imports */
type IPath = {
  parent: string;
  parentPath: IPath;
};

function getParent(path: IPath, level: number): any {
  if (!level) {
    return path.parent;
  }
  return getParent(path.parentPath, level - 1);
}

export function findDependencies(content: string) {
  const parser = require('@babel/parser');
  const traverse = require('@babel/traverse').default;

  const sourceList: Array<string> = [];
  const ast = parser.parse(content, {
    // 不加这个配置，报错：SyntaxError: 'import' and 'export' may appear only with 'sourceType: "module"'
    sourceType: 'module',
    plugins: ['typescript'],
  });

  traverse(ast, {
    CallExpression(path: any) {
      if (path.node.callee.name === 'require') {
        if (path.node.arguments[0].type === 'StringLiteral') {
          sourceList.push(path.node.arguments[0].value);
        }
        if (
          getParent(path, 0).type === 'ExpressionStatement'
          && getParent(path, 1).type === 'BlockStatement'
          && getParent(path, 2).type === 'ObjectMethod'
          && getParent(path, 3).type === 'ObjectExpression'
          && getParent(path, 4)?.type === 'ObjectProperty'
          && getParent(path, 4)?.key?.name === 'components'
          && getParent(path, 5)?.type === 'ObjectExpression'
          && getParent(path, 6)?.type === 'ExportDefaultDeclaration'
          && path.node.arguments[0].type === 'ArrayExpression') {
          sourceList.push(path.node.arguments[0].elements[0].value);
        }
      }
    },
    ImportDeclaration(path: any) {
      sourceList.push(path.node.source.value);
    },
  });
  return sourceList;
}

