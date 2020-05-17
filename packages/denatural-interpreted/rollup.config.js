const resolve = require('@rollup/plugin-node-resolve');
const sourceMaps = require('rollup-plugin-sourcemaps');
const typescript = require('rollup-plugin-typescript2');



export default {
    input: `source/index.ts`,
    output: [
        {
            file: './distribution/index.js',
            format: 'cjs',
            sourcemap: true,
        },
    ],
    watch: {
        include: 'source/**',
    },
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true,
        }),
        resolve({
            preferBuiltins: true,
        }),
        sourceMaps(),
    ],
}
