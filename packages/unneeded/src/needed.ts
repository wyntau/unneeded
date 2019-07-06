import { neededTypescript } from '@unneeded/needed-typescript';
import { neededVue } from '@unneeded/needed-vue';
import { neededCSSLike } from '@unneeded/needed-csslike';
import Resolver from 'enhanced-resolve/lib/Resolver';
import * as fs from 'fs';
import * as path from 'path';
import { IAlias } from '.';
import * as resolver from './resolver';

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
  return resolver.resolve(neededList, options);
}

export async function neededOfVue(options: INeededOfTypeOptions): Promise<Array<string>> {
  const neededList = neededVue(options.fileContent);
  return resolver.resolve(neededList, options);
}

export async function neededOfCSSLike(options: INeededOfTypeOptions, extname: string): Promise<Array<string>> {
  const neededList = neededCSSLike(options.fileContent, extname.replace('.', ''));
  return resolver.resolve(neededList, options);
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
    case '.css':
    case '.scss':
    case '.sass':
    case '.less':
    case '.styl':
      return neededOfCSSLike(neededOfTypeOptions, extname);
    default:
      return [];
  }
}
