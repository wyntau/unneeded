import { neededTypescript } from '..';
import { describe, it } from 'mocha';
import { expect } from 'chai';

const test = `
import 'import';
import { b } from './importfrom';
export * from 'export';

define(['define']);

const a: typeof import('importtype') = '1';

var abc = require('require');
`;

describe('parse', () => {
  it('should parse es', () => {
    expect(neededTypescript(test, { amd: false, cjs: false })).deep.equal([
      'import',
      './importfrom',
      'export',
      'importtype',
    ]);
  });

  it('should parse es + amd', () => {
    expect(neededTypescript(test, { amd: true, cjs: false })).deep.equal([
      'import',
      './importfrom',
      'export',
      'define',
      'importtype',
      'require',
    ]);
  });

  it('should parse es + commonjs', () => {
    expect(neededTypescript(test, { amd: false, cjs: true })).deep.equal([
      'import',
      './importfrom',
      'export',
      'importtype',
      'require',
    ]);
  });
});
