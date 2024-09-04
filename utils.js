import * as Fs from 'fs'
import * as Path from 'path'
import { Command } from 'commander'

export
function parse
(lr, file) {
  let tree, content
  content = Fs.readFileSync(file, 'utf8')
  //console.log(content)
  tree = lr.parser.parse(content)
  return { tree: tree, content: content }
}

export
function pretty
(node, offset = 0, indent = 0) {
  if (node) {
    let ret, child, prefix

    ret = ''
    prefix = ''
    if (indent)
      prefix = ' '.repeat(offset)
    offset += (node.name.length + 1)
    child = node.firstChild
    while (child) {
      let str

      str = pretty(child, offset, ret.length)
      if (str) {
        if (ret.length)
          ret += ',\n'
        ret += str
      }
      child = child.nextSibling
    }

    return prefix + node.name + (ret.length ? '(' + ret + ')' : '')
  }
  return ''
}

export
function check
(tree) {
  let fail
  fail = []
  tree.iterate({enter: node => {
    if (node.type.isError) {
      fail.push({ from: node.from })
      return 0
    }
    return 1
  }})
  return fail.length ? fail : 0
}

function printFails
(path, fails) {
  fails.forEach(fail => console.log(path + ':' + fail.from + ': error: failed to parse'))
}

// returns number failed
export
function checkDir
(lr, dir, recursive) {
  let data, count

  data = Fs.readdirSync(dir, { recursive: recursive ? true : false })

  count = 0
  data.forEach(name => {
    if (name.endsWith('.zig')) {
      let res, path, fails

      path = Path.join(dir, name)
      res = parse(lr, path)
      console.log(path + ' (' + res.content.length + ' bytes)')
      fails = check(res.tree)
      if (fails) {
        count++
        printFails(path, fails)
        //throw 'parse failed'
      }
    }
  })

  return count
}

// returns number failed
export
function checkFile
(lr, path) {
  let res, fails

  res = parse(lr, path)
  fails = check(res.tree)
  if (fails) {
    printFails(path, fails)
    return 1
  }
  return 0
}

export
function checkFileOrDir
(lr, path, recurse) {
  let stats

  stats = Fs.statSync(path)
  if (stats.mode & (1 << 15))
    return checkFile(lr, path)
  return checkDir(lr, path, recurse)
}

export
function mainShow
(lr) {
  function run
  (file) {
    let res

    res = parse(lr, file)
    console.log('tree.length: ' + res.tree.length)
    console.log('tree:')
    console.log(pretty(res.tree.topNode))
  }

  new Command()
    .description('Print parse tree given a source file')
    .argument('<file>', 'source file')
    .action(run)
    .parse()
}

export
function mainChk
(lr) {
  function run
  (path, opts) {
    let count

    console.log('Checking ' + path)
    count = checkFileOrDir(lr, path, opts.recurse)
    if (count) {
      console.log('\nFAILED: ' + count + ' file')
      process.exitCode = 2
    }
    else
      console.log('\nALL GOOD')
  }

  new Command()
    .description('Check the parser against a file or dir')
    .argument('<path>', 'file or directory')
    .option('-r, --recurse')
    .action(run)
    .parse()
}
