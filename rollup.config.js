import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
export default {
    input: './src/index.js',
    output: {
        file: './dist/vue.js',
        name: 'Vue', // 全局挂载Vue
        format: 'umd',  // umd 兼容（cjs,amd,iife）
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve()
    ]
}