import { neededCSSLike } from '..';
import { describe, it } from 'mocha';
import { expect } from 'chai';

const cssString = `
@import './abc.css';
@import 'scss.scss';
@import 'sass.sass';
@import 'less.less';
@import 'stylus.styl';
body {
  background-image: url(./foo.png);
}
div {
  background-image: url(bar.jpg);
}
`;

describe('needed-csslike', () => {
  it('type css', () => {
    expect(neededCSSLike(cssString, 'css')).to.deep.equal([
      './abc.css',
      'scss.scss',
      'sass.sass',
      'less.less',
      'stylus.styl',
      './foo.png',
      'bar.jpg',
    ]);
  });

  it('type sass', () => {
    expect(neededCSSLike(cssString, 'sass')).to.deep.equal([
      'scss.scss',
      'sass.sass',
      'less.less',
      'stylus.styl',
      './abc.css',
      './foo.png',
      'bar.jpg',
    ]);
  });

  it('type scss', () => {
    expect(neededCSSLike(cssString, 'scss')).to.deep.equal([
      'scss.scss',
      'sass.sass',
      'less.less',
      'stylus.styl',
      './abc.css',
      './foo.png',
      'bar.jpg',
    ]);
  });

  it('ignore URL', () => {
    expect(
      neededCSSLike(`
    body {
      background-image: url(foo.jpg);
      background-image: url(https://example.com/asserts/logo.png);
    }`),
      'css'
    ).to.deep.equal(['foo.jpg']);
  });

  // it('type less', () => {
  //   expect(neededCSSLike(cssString, 'less')).to.deep.equal(['./abc.css', './foo.png', 'bar.jpg']);
  // });

  // it('type stylus', () => {
  //   expect(neededCSSLike(cssString, 'stylus')).to.deep.equal(['./abc.css', './foo.png', 'bar.jpg']);
  // });

  // it('type styl', () => {
  //   expect(neededCSSLike(cssString, 'styl')).to.deep.equal(['./abc.css', './foo.png', 'bar.jpg']);
  // });
});
