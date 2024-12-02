import * as Fs from 'fs'
import * as Path from 'path'
import { Command } from 'commander'
import * as CMState from '@codemirror/state'

import { pretty } from './pretty'

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
function check
(tree) {
  let fail

  fail = []
  tree.iterate({ enter: node => {
    if (node.type.isError) {
      fail.push({ from: node.from })
      return 0
    }
    return 1
  } })
  return fail.length ? fail : 0
}

function printFails
(path, tree, fails) {
  let text, state

  text = Fs.readFileSync(path, { encoding: 'utf8' })
  //console.log({ text })
  state = CMState.EditorState.create({ doc: text || '' })

  if (tree.length == state.doc.length) {
    // parse was complete
  }
  else
    console.log(path + ':0:0: error: tree partially covers doc')

  fails.forEach(fail => {
    let line, col

    line = state.doc.lineAt(fail.from)
    col = (fail.from - line.from) + 1

    console.log(path + ':' + line.number + ':' + col + ': error: failed to parse')
  })
}

// returns number failed
export
function checkDir
(lr, dir, opts) {
  let data, count, ext

  data = Fs.readdirSync(dir, { recursive: opts?.recurse ? true : false })

  if (opts?.ext)
    ext = '.' + opts.ext

  count = 0
  data.forEach(name => {
    let path, stats

    path = Path.join(dir, name)
    try {
      stats = Fs.statSync(path)
    }
    catch (err) {
      console.log(err.message)
      return
    }
    if ((stats.mode & (1 << 15)) // is it a file?
        && (ext ? name.endsWith(ext) : 1)) {
      let res, fails

      res = parse(lr, path)
      console.log(path + ' (' + res.content.length + ' bytes)')
      fails = check(res.tree)
      if (fails) {
        count++
        printFails(path, res.tree, fails)
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
    printFails(path, res.tree, fails)
    return 1
  }
  return 0
}

export
function checkFileOrDir
(lr, path, opts) {
  let stats

  try {
    stats = Fs.statSync(path)
  }
  catch (err) {
    console.log(err.message)
    return
  }
  if (stats.mode & (1 << 15))
    return checkFile(lr, path)
  return checkDir(lr, path, opts)
}

export
function mainShow
(lr) {
  function run
  (file) {
    let res, text, state

    res = parse(lr, file)

    text = Fs.readFileSync(file, { encoding: 'utf8' })
    state = CMState.EditorState.create({ doc: text || '' })

    console.log('tree contains error: ' + (check(res.tree) ? 'yes' : 'no'))
    console.log('tree covers source: ' + ((res.tree.length == state.doc.length) ? 'yes' : 'no'))
    console.log('tree length: ' + res.tree.length)
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
    count = checkFileOrDir(lr, path, { ext: opts.ext, recurse: opts.recurse })
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
    .option('-e, --ext <extension>', 'file ext when checking dir')
    .action(run)
    .parse()
}
