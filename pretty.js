function escape
(name) {
  return name
    .replace('\\', '\\\\')
    .replace('(', '\\(')
    .replace(')', '\\)')
    .replace(',', '\\,')
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

    return prefix + escape(node.name) + (ret.length ? '(' + ret + ')' : '')
  }
  return ''
}
