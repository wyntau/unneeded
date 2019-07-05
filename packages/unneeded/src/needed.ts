import { parse as neededTypescript } from '@unneeded/needed-typescript';
import { CachedInputFileSystem, NodeJsInputFileSystem, ResolverFactory } from 'enhanced-resolve';
import Resolver from 'enhanced-resolve/lib/Resolver';
import { parseComponent as vueParseComponent } from 'vue-template-compiler';
import * as fs from 'fs';
import * as path from 'path';
import { IAlias } from '.';

export interface INeededOfFileOptions {
  fileAbsolutePath: string;
  alias: IAlias;
  extensions: Array<string>;
  resolver?: Resolver;
}
export interface INeededOfTypeOptions extends INeededOfFileOptions {
  fileContent: string;
}
export type INeededOfType = (options: INeededOfTypeOptions) => Promise<Array<string>>;

export async function neededOfTypescript(options: INeededOfTypeOptions) {
  const fileContent = options.fileContent;
  const neededList = neededTypescript(fileContent);
  let resolver = options.resolver;
  if (!resolver) {
    resolver = ResolverFactory.createResolver({
      // @ts-ignore
      fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 4000),
      alias: options.alias,
      extensions: options.extensions,
      modules: [],
    });
  }

  const resolvedList: Array<string> = [];
  const fileDirname = path.dirname(options.fileAbsolutePath);

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

export async function neededOfVue(options: INeededOfTypeOptions): Promise<Array<string>> {
  const compileResult = vueParseComponent(options.fileContent);
  if (!compileResult.script || !compileResult.script.content) {
    return [];
  }

  return neededOfTypescript({ ...options, fileContent: compileResult.script.content });
}

export async function neededOfFile(
  fileAbsolutePath: string,
  resolvedAlias: IAlias,
  extensions: Array<string>,
  resolver?: Resolver
): Promise<Array<string>> {
  const extname = path.extname(fileAbsolutePath);
  const fileContent = fs.readFileSync(fileAbsolutePath, { encoding: 'utf-8' });
  const neededOfTypeOptions: INeededOfTypeOptions = {
    fileAbsolutePath,
    fileContent,
    alias: resolvedAlias,
    extensions,
    resolver,
  };

  switch (extname) {
    case '.ts':
    case '.tsx':
    case '.js':
    case '.jsx':
      return neededOfTypescript(neededOfTypeOptions);
    case '.vue':
      return neededOfVue(neededOfTypeOptions);
    default:
      return [];
  }
}
