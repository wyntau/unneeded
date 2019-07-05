import { neededOfFile } from './needed';
import * as path from 'path';
import readdir from 'recursive-readdir';

export interface IAlias {
  [key: string]: string;
}

export interface IOptions {
  context?: string;
  audit: Array<string>;
  entry: Array<string>;
  alias?: IAlias;
  extensions?: Array<string>;
}

export async function unneeded(options: IOptions) {
  options = Object.assign(
    {
      context: process.cwd(),
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {},
    },
    options
  );

  if (!options.entry || !options.audit) {
    return [];
  }

  const resolvedAlias = Object.keys(options.alias!).reduce((ret, key) => {
    ret[key] = path.resolve(options.context!, options.alias![key]);
    return ret;
  }, {});

  const AllNeededFiles = options.entry.map(entry => path.resolve(options.context!, entry));
  for (let i = 0; i < AllNeededFiles.length; i++) {
    const neededFiles = await neededOfFile(AllNeededFiles[i], resolvedAlias, options.extensions!);
    neededFiles.forEach(item => {
      if (AllNeededFiles.indexOf(item) < 0) {
        AllNeededFiles.push(item);
      }
    });
  }

  const allFiles: { [key: string]: boolean } = {};
  for (let j = 0; j < options.audit.length; j++) {
    const files = await readdir(path.resolve(options.context!, options.audit[j]));
    files.forEach(file => {
      allFiles[file] = true;
    });
  }

  AllNeededFiles.forEach(file => {
    try {
      delete allFiles[file];
    } catch {
      // nothing
    }
  });

  return Object.keys(allFiles)
    .sort()
    .map(item => path.relative(options.context!, item));
}
