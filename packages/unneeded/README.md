## unneeded

Find unneeded file in directories by checking some entry files.

### Usage
```js
import { unneeded } from '@unneeded/unneeded'
unneeded({
  context: '.',
  entry: ['path/to/entry.js'],
  audit: ['path']
})
```

### Options
- `context`, the cwd for unneeded
- `entry`, the array of entry files
- `audit`, the array of directories you want to check if there are some files are unneeded

### License
MIT