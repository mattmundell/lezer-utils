Utils for working with [Lezer](https://lezer.codemirror.net) grammars.

## Example

In your grammar package, add bin/chk containing this:

```js
#!/usr/bin/env node
import { mainChk } from 'lezer-utils'
import { lr } from '../dist/index.js'
mainChk(lr)
```

then use `chk` to test the parser against a dir:
```
$ ~/src/codemirror-lang-zig/bin/chk -r ~/src/zig/src/link/tapi/
Checking /home/you/src/zig/src/link/tapi/
/home/you/src/zig/src/link/tapi/Tokenizer.zig 13087
/home/you/src/zig/src/link/tapi/parse.zig 23795
/home/you/src/zig/src/link/tapi/yaml.zig 17604
/home/you/src/zig/src/link/tapi/parse/test.zig 23445
/home/you/src/zig/src/link/tapi/yaml/test.zig 12873

ALL GOOD
```
