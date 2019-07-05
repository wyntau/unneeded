import { parse as neededTypescript } from '@unneeded/needed-typescript';
import { CachedInputFileSystem, NodeJsInputFileSystem, ResolverFactory } from 'enhanced-resolve';
import Resolver from 'enhanced-resolve/lib/Resolver';
import * as path from 'path';
import * as fs from 'fs';

export interface IAlias {
  [key: string]: string;
}

export interface IOptions {
  context?: string;
  audit: string | Array<string>;
  entry: string | Array<string>;
  alias?: IAlias;
  extensions?: Array<string>;
}

let resolver: Resolver;

async function parseNeeded(
  fileAbsolutePath: string,
  context: string,
  alias: IAlias,
  extensions: Array<string>
): Promise<Array<string>> {
  const fileContent = fs.readFileSync(fileAbsolutePath, { encoding: 'utf-8' });
  const neededList = neededTypescript(fileContent);

  if (!resolver) {
    const resolvedAlias = Object.keys(alias).reduce((ret, key) => {
      ret[key] = path.resolve(context, alias[key]);
      return ret;
    }, {});
    resolver = ResolverFactory.createResolver({
      // @ts-ignore
      fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 4000),
      alias: resolvedAlias,
      extensions,
      modules: [],
    });
  }

  const resolvedList: Array<string> = [];
  const fileDirname = path.dirname(fileAbsolutePath);

  for (let i = 0; i < neededList.length; i++) {
    await new Promise(resolve => {
      resolver.resolve({}, fileDirname, neededList[i], (err, file) => {
        if (err) {
          resolve();
          return;
        }

        resolvedList.push(file);
        resolve();
      });
    });
  }

  return resolvedList;
}

export async function unneeded(options: IOptions) {
  console.log('abc');
  options = Object.assign(
    {},
    {
      cwd: process.cwd(),
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {},
    },
    options
  );

  if (!options.entry || !options.audit) {
    process.exit(1);
    return;
  }

  const entry =
    typeof options.entry === 'string'
      ? [path.join(options.context!, options.entry)]
      : options.entry.map(entry => path.join(options.context!, entry));

  const used = entry.slice();

  for (let i = 0; i < used.length; i++) {
    const needed = await parseNeeded(used[i], options.context!, options.alias!, options.extensions!);
    needed.forEach(item => {
      if (used.indexOf(item) < 0) {
        used.push(item);
      }
    });
  }

  return used;
}
