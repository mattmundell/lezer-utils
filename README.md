Utils for working with [Lezer](https://lezer.codemirror.net) grammars.

## Requirements

Your grammar package must export your `LRLanguage` as `lr`, and your support function as `language`.
```typescript
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

In your grammar package, add bin/show containing this:

```js
#!/usr/bin/env node
import { mainShow } from 'lezer-utils'
import { lr } from '../dist/index.js'
mainShow(lr)
```

then use `show` to test the parser against a dir:
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
```

## Build from source

```
npm i
npm run prepare
```
