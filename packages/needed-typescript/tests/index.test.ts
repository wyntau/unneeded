import { parse } from '..';
import { describe, it } from 'mocha';
import { expect } from 'chai';

const test = `
import 'abc';
import {b } from './aaa';

define(['abcd']);

var abc = require('foo');
`;

describe('parse', () => {
  it('should parse success', () => {
    expect(parse(test, { amd: false })).deep.equal(['abc', './aaa', 'foo']);
  });
});
