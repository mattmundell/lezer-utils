import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [ { input: 'utils.js',
                   output: [ { file: 'dist/index.cjs', format: 'cjs' },
                             { file: 'dist/index.js', format: 'es' } ],
                   plugins: [ nodeResolve(), commonjs() ] },
                 { input: 'pretty.js',
                   output: [ { file: 'dist/pretty.cjs', format: 'cjs' },
                             { file: 'dist/pretty.js', format: 'es' } ],
                   plugins: [] } ]
