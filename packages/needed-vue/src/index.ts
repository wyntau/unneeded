import { compile, parseComponent, ASTNode } from 'vue-template-compiler';
import { neededTypescript } from '@unneeded/needed-typescript';
import { neededCSSLike } from '@unneeded/needed-csslike';

export function neededVueHtml(fileContent: string): Array<string> {
  const compileResult = compile(fileContent);
  const needed: Array<string> = [];

  (function travelNode(node: ASTNode) {
    if (!node || node.type !== 1) {
      return;
    }

    node.children.forEach(travelNode);

    if (node.tag !== 'img') {
      return;
    }

    const srcAttr = node.attrsList.find(item => item.name === 'src');
    if (!srcAttr) {
      return;
    }

    if (needed.indexOf(srcAttr.value) < 0) {
      needed.push(srcAttr.value);
    }
  })(compileResult.ast!);

  return needed;
}

export function neededVue(fileContent: string): Array<string> {
  const parseResult = parseComponent(fileContent);

  let needed: Array<string> = [];

  if (parseResult.script && parseResult.script.content) {
    needed = needed.concat(neededTypescript(parseResult.script.content));
  }

  if (parseResult.template && parseResult.template.content) {
    needed = needed.concat(neededVueHtml(parseResult.template.content));
  }

  if (parseResult.styles && parseResult.styles.length) {
    parseResult.styles.forEach(style => {
      needed = needed.concat(neededCSSLike(style.content, style.lang));
    });
  }

  return needed;
}
