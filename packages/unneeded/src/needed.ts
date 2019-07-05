import { parse as neededTypescript } from '@unneeded/needed-typescript';
import { CachedInputFileSystem, NodeJsInputFileSystem, ResolverFactory } from 'enhanced-resolve';
import Resolver from 'enhanced-resolve/lib/Resolver';
import * as fs from 'fs';
import * as path from 'path';
import { IAlias } from '.';

export async function neededOfTypescript(
  fileAbsolutePath: string,
  resolvedAlias: IAlias,
  extensions: Array<string>,
  resolver?: Resolver
) {
  const fileContent = fs.readFileSync(fileAbsolutePath, { encoding: 'utf-8' });
  const neededList = neededTypescript(fileContent);

  if (!resolver) {
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
      // deprecated warning fix
      // @ts-ignore
      resolver!.resolve({}, fileDirname, neededList[i], {}, (err, file) => {
        if (!err) {
          resolvedList.push(file);
        }
        resolve();
      });
    });
  }

  return resolvedList;
}

export async function neededOfFile(
  fileAbsolutePath: string,
  resolvedAlias: IAlias,
  extensions: Array<string>,
  resolver?: Resolver
): Promise<Array<string>> {
  const extname = path.extname(fileAbsolutePath);

  switch (extname) {
    case '.ts':
    case '.tsx':
    case '.js':
    case '.jsx':
      return neededOfTypescript(fileAbsolutePath, resolvedAlias, extensions, resolver);
    default:
      return [];
  }
}
