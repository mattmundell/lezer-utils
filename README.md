Utils for working with [Lezer](https://lezer.codemirror.net) grammars.

## Requirements

Your grammar package must export your `LRLanguage` as `lr`, and your support function as `language`.
```js
export const zigLanguage = LRLanguage.define({ ... })
export function zig() {
  return new LanguageSupport(zigLanguage)
}

// You'll probably need to add something like this.
export const lr = zigLanguage
export const language = zig
```

## Examples

### Check a dir

#### Dynamic

Run `lzchk` with args `module`, `lr_name` and `dir`:

```
$ ./bin/lzchk ~/src/codemirror-lang-kcl/dist/index.js KclLanguage ~/src/modeling-app/src/wasm-lib/kcl/ -r --ext kcl

Checking /home/you/src/modeling-app/src/wasm-lib/kcl/
/home/you/src/modeling-app/src/wasm-lib/kcl/common.kcl (340 bytes)
/home/you/src/modeling-app/src/wasm-lib/kcl/tests/add_lots/input.kcl (868 bytes)
/home/you/src/modeling-app/src/wasm-lib/kcl/tests/add_lots/input.kcl:1:5: error: failed to parse
...

FAILED: 44 file
```


#### Static

In your grammar package, add bin/chk containing this:

```js
#!/usr/bin/env node
import { mainChk } from 'lezer-utils'
import { lr } from '../dist/index.js'
mainChk(lr)
```

then use `chk` to test the parser against a dir:
```
$ ./bin/chk -r ~/src/zig/src/link/tapi/ --ext zig
Checking /home/you/src/zig/src/link/tapi/
/home/you/src/zig/src/link/tapi/Tokenizer.zig 13087
/home/you/src/zig/src/link/tapi/parse.zig 23795
/home/you/src/zig/src/link/tapi/yaml.zig 17604
/home/you/src/zig/src/link/tapi/parse/test.zig 23445
/home/you/src/zig/src/link/tapi/yaml/test.zig 12873

ALL GOOD
```

### Print a tree

#### Js

```js
import { pretty } from 'lezer-utils/pretty'

pretty(CMLang.syntaxTree(state).topNode)
```

#### Binary

In your grammar package, add bin/show containing this:

```js
#!/usr/bin/env node
import { mainShow } from 'lezer-utils'
import { lr } from '../dist/index.js'
mainShow(lr)
```

then use `show` to print the tree:
```
$ ./bin/show ~/src/zig/lib/std/os/uefi/tables/table_header.zig
tree contains error: no
tree covers source: yes
tree length: 214
tree:
Program(pub,
        Decl(GlobalVarDecl(VarDeclProto(const,
                                        Name),
                           Expr(TypeExpr(ContainerDecl(extern,
                                                       ContainerDeclAuto(ContainerDeclType(struct),
                                                                         ContainerField(Identifier,
                                                                                        TypeExpr(Identifier)),
                                                                         ContainerField(Identifier,
                                                                                        TypeExpr(Identifier)),
                                                                         ContainerField(DocComment,
                                                                                        Identifier,
                                                                                        TypeExpr(Identifier)),
                                                                         ContainerField(Identifier,
                                                                                        TypeExpr(Identifier)),
                                                                         ContainerField(Identifier,
                                                                                        TypeExpr(Identifier)))))))))
```

## Build from source

```
npm i
npm run prepare
```
