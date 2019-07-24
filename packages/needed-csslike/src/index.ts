import gonzales from 'gonzales-pe';

export function neededCSSLike(fileContent: string, type: string = 'css'): Array<string> {
  switch (type) {
    case 'css':
    case 'scss':
    case 'less':
      const parseTree = gonzales.parse(fileContent, { syntax: type });
      const needed: Array<string> = [];
      parseTree.traverseByTypes(['atkeyword', 'uri'], (node, _, parent) => {
        switch (node.type) {
          case 'atkeyword':
            if (node.content[0].content === 'import') {
              const importFile = parent.content[parent.content.length - 1].content.replace(/(^['"])|(['"]$)/g, '');
              if (needed.indexOf(importFile) < 0) {
                needed.push(importFile);
              }
            }
            break;
          case 'uri':
            const url = node.content[0].content.replace(/(^['"])|(['"]$)/g, '');
            if (!url.match(/^(https?:)?\/{1,2}/) && needed.indexOf(url) < 0) {
              needed.push(url);
            }
            break;
        }
      });
      return needed;
    default:
      return [];
  }
}
