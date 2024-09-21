import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as parser from '@babel/parser';
import type { Node, ArrayExpression, ObjectExpression, ObjectProperty } from '@babel/types';
import type { FoundItem } from './types';


const TYPE_MAP = {
  ObjectExpression: 'ObjectExpression',
  ArrayExpression: 'ArrayExpression',

  UnaryExpression: 'UnaryExpression', // 一元表达式，比如 -1，!0

  ObjectProperty: 'ObjectProperty', // 对象属性
  ObjectMethod: 'ObjectMethod', // 对象方法，例如 { c(){} }
  Literal: 'Literal',
  StringLiteral: 'StringLiteral',
  NumericLiteral: 'NumericLiteral',
};


function checkOneDeclaration(declaration: any, foundData: FoundItem[]) {
  const { init, id } = declaration;
  const { name } = id;
  if (!init) return;

  const result = checkElementConstant(init);

  if (result) {
    const result = generate(declaration, {});

    foundData.push({
      value: result.code,
      name,
      start: declaration.start,
    });
  }
}


export function parseLongConstant(source: string) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['typescript'],
  });
  const foundData: Array<FoundItem> = [];


  traverse(ast, {
    VariableDeclaration(path) {
      path.node.declarations.forEach(declaration => checkOneDeclaration(declaration, foundData));
    },
  });

  return foundData;
}


function checkObjectConstant(node: ObjectExpression) {
  for (const property of node.properties) {
    if (property.type === TYPE_MAP.ObjectMethod) {
      return false;
    }

    const temp = checkElementConstant((property as ObjectProperty).value);
    if (!temp) {
      return false;
    }
  }
  return true;
}

function checkElementConstant(node: Node) {
  const propType = node.type;
  // console.log('[checkElementConstant] propType: ', propType);

  if (propType === TYPE_MAP.Literal || propType.endsWith(TYPE_MAP.Literal) || propType === TYPE_MAP.UnaryExpression) {
    return true;
  }

  if (propType === TYPE_MAP.ObjectExpression) {
    return checkObjectConstant(node as ObjectExpression);
  }

  if (propType === TYPE_MAP.ArrayExpression) {
    return checkArrayConstant(node as ArrayExpression);
  }

  // console.log('[checkElementConstant] unknown type: ', propType);
  return false;
}


function checkArrayConstant(node: ArrayExpression) {
  for (const element of node.elements) {
    if (!element) {
      continue;
    }
    const temp = checkElementConstant(element!);
    if (!temp) {
      return false;
    }
  }
  return true;
}


