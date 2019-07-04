import { parse as neededTypescript } from '@unneeded/needed-typescript';
import * as path from 'path';
import * as fs from 'fs';

export interface IAlias {
  [key: string]: string;
}

export interface IOptions {
  cwd?: string;
  scanning: string | Array<string>;
  entry: string | Array<string>;
  alias?: IAlias;
  extensions?: Array<string>;
}

function isAliasImport(module: string, alias: IAlias): boolean {
  return Object.keys(alias).some(key => module.indexOf(key) === 0);
}

function parseNeeded(fileAbsolutePath: string, cwd: string, alias: IAlias, extensions: Array<string>): Array<string> {
  console.log(fileAbsolutePath);
  const fileContent = fs.readFileSync(fileAbsolutePath, { encoding: 'utf-8' });

  const needed = neededTypescript(fileContent);

  return needed
    .filter(item => {
      return item.indexOf('.') === 0 || isAliasImport(item, alias);
    })
    .map(item => {
      let file;

      if (!isAliasImport(item, alias)) {
        file = path.resolve(path.dirname(fileAbsolutePath), item);
      } else {
        const key = Object.keys(alias).find(key => item.indexOf(key) === 0)!;
        file = path.join(cwd, alias[key], item.replace(key, ''));
      }

      // console.log(file);

      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return file;
      }

      for (let i = 0; i < extensions.length; i++) {
        if (fs.existsSync(file + extensions[i])) {
          return file + extensions[i];
        }
      }

      return '';
    })
    .filter(item => item !== '');
}

export function unneeded(options: IOptions) {
  options = Object.assign(
    {},
    {
      cwd: process.cwd(),
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {},
    },
    options
  );

  if (!options.entry || !options.scanning) {
    process.exit(1);
    return;
  }

  const entry =
    typeof options.entry === 'string'
      ? [path.join(options.cwd!, options.entry)]
      : options.entry.map(entry => path.join(options.cwd!, entry));
  // const scanning = typeof options.scanning === 'string' ? [options.scanning] : options.scanning;

  const used = entry.slice();
  // const unused: Array<string> = [];

  for (let i = 0; i < used.length; i++) {
    const needed = parseNeeded(used[i], options.cwd!, options.alias!, options.extensions!);
    needed.forEach(item => {
      if (used.indexOf(item) < 0) {
        used.push(item);
      }
    });
  }

  // console.log(used);

  return used;
}
