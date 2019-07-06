import { unneeded } from '..';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('needed', () => {
  it('should return success', async function() {
    const neededList = await unneeded({
      context: __dirname,
      audit: ['fixture'],
      entry: ['fixture/foo.js'],
    });

    expect(neededList).to.deep.equal(['fixture/bar.js', 'fixture/baz.js']);
  });
});
