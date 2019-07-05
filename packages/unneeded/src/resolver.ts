import { INeededOfTypeOptions } from './needed';
import { ResolverFactory, CachedInputFileSystem, NodeJsInputFileSystem } from 'enhanced-resolve';
import * as path from 'path';

export async function resolve(neededList: Array<string>, options: INeededOfTypeOptions): Promise<Array<string>> {
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
