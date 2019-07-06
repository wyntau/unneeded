import { neededVue } from '..';
import { describe, it } from 'mocha';
import { expect } from 'chai';

const vueContent = `
<template>
<img src="./foo.jpg">
</template>
<script>
import foo from './foo';
</script>
<style lang="scss">
@import 'css.css';
@import 'scss.scss';
@import 'sass.sass';
@import 'less.less';
body {
  background-image: url(bar.png)
}
</style>
`;

describe('needed-vue', () => {
  it('parse vue', () => {
    const needed = neededVue(vueContent);
    expect(needed).to.deep.equal(['./foo', './foo.jpg', 'scss.scss', 'sass.sass', 'less.less', 'css.css', 'bar.png']);
  });
});
