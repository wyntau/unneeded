import * as ts from 'typescript';

export interface IOptions {
  cjs?: boolean;
  amd?: boolean;
}

export function parse(fileContent: string, options: IOptions = {}): Array<string> {
  options = Object.assign({}, { cjs: true, amd: true }, options);

  const sourceFile = ts.createSourceFile(
    'typescript.tsx',
    fileContent,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX
  );

  const dependency: Array<string> = [];

  (function travelNode(tsNode: ts.Node) {
    ((tsNode: ts.Node) => {
      switch (tsNode.kind) {
        case ts.SyntaxKind.ImportDeclaration: {
          const importDeclaration = tsNode as ts.ImportDeclaration;
          dependency.push((importDeclaration.moduleSpecifier as ts.StringLiteral).text);
          break;
        }
        case ts.SyntaxKind.ExportDeclaration: {
          const exportDeclaration = tsNode as ts.ExportDeclaration;
          if (!exportDeclaration.moduleSpecifier) {
            return;
          }
          dependency.push((exportDeclaration.moduleSpecifier as ts.StringLiteral).text);
          break;
        }
        case ts.SyntaxKind.CallExpression: {
          const callExpression = tsNode as ts.CallExpression;
          switch (callExpression.expression.kind) {
            case ts.SyntaxKind.ImportKeyword: {
              dependency.push((callExpression.arguments[0] as ts.StringLiteral).text);
              break;
            }
            case ts.SyntaxKind.Identifier: {
              const expression = callExpression.expression as ts.Identifier;
              switch (expression.text) {
                case 'define': {
                  if (!options.amd) {
                    return;
                  }

                  // define(['foo', 'bar'])
                  // 只允许数组形式的字符串字面量
                  // 找到第一个字符串数组, 兼容 define(['foo', 'bar'], function) 和 define('id', ['foo', 'bar'], function)
                  const arrayStringLiteral = callExpression.arguments.find(
                    argument => ts.isArrayLiteralExpression(argument) && argument.elements.every(ts.isStringLiteral)
                  );
                  if (!arrayStringLiteral) {
                    return;
                  }
                  (arrayStringLiteral as ts.ArrayLiteralExpression).elements.forEach(element => {
                    const importModule = (element as ts.StringLiteral).text;
                    dependency.push(importModule);
                  });
                  break;
                }
                case 'require': {
                  if (!options.cjs && !options.amd) {
                    return;
                  }

                  // require('foo');
                  // require 的不是字符串则不处理
                  if (!callExpression.arguments.every(ts.isStringLiteral)) {
                    return;
                  }

                  // 获取加载的模块, 如果不是组件模块, 则放入加载文件中返回
                  const importModule = (callExpression.arguments[0] as ts.StringLiteral).text;
                  dependency.push(importModule);
                  break;
                }
                default:
                  break;
              }
              break;
            }
          }
          break;
        }
        default:
          break;
      }
    })(tsNode);
    ts.forEachChild(tsNode, travelNode);
  })(sourceFile);

  return dependency;
}
