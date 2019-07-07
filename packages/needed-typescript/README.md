## needed-typescript

Find the needed external dependencies in a es file

### Usage
```js
import { neededTypescript } from '@unneeded/needed-typescript';
neededTypescript(fileContent, options);
```

### Options
- `options.cjs`, default to `true`, if parse `require` in cjs
- `options.amd`, default to `true`, if parse `define` and `require` in amd


### Supported file types

- js
- jsx
- ts
- tsx

### Supported module types

- es
- cjs
- amd

### License
MIT