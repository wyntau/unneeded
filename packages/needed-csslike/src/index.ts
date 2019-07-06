import detectivePostcss from 'detective-postcss';
import sass from 'sass';

export type IFileType = 'css' | 'sass' | 'scss' | 'less' | 'stylus' | 'styl';

export function neededCSSLike(fileContent: string, type: IFileType = 'css'): Array<string> {
  switch (type) {
    case 'css':
      return detectivePostcss(fileContent, { url: true });
    case 'sass':
    case 'scss':
      let needed: Array<string> = [];
      const renderResult = sass.renderSync({
        data: fileContent,
        importer: (url: string) => {
          needed.push(url);
          return {
            contents: '',
          };
        },
      });
      return needed.concat(detectivePostcss(renderResult.css.toString(), { url: true }));
    default:
      return [];
  }
}
