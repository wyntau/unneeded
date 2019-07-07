## needed-csslike

Find the needed external dependencies in a csslike file.

### Supported css types

- css
- scss
- sass

### Usage
```js
import { neededCSSLike } from '@unneeded/needed-csslike';
const cssContent = `
@import 'foo.css';
body {
  background-image: url(bar.jpg)
}
`;
console.log(neededCSSLike(cssContent, 'css')); // ['foo.css', 'bar.jpg']
```

### License
MIT