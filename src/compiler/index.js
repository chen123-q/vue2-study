import { parseHTML } from "./parse";

function genProps(attrs) {
    let str = '' // {name,value}
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            // color:red;background: pink;=>{color:red}
            let obj = {}
            attr.value.split(';').map(item => {
                let [name, value] = item.split(':')
                obj[name] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},` // a:"b",c:"d"

    }
    return `{${str.slice(0, -1)}}`
}
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function gen(node) {
    if (node.type === 1) {
        return codegen(node)
    }
    let { text } = node
    if (!defaultTagRE.test(text)) {
        return `_v(${JSON.stringify(text)})`
    }
    // _v( _s(name) + 'hello' + _s(age))
    let tokens = []
    let match
    defaultTagRE.lastIndex = 0 // 捕获完 lastIndex 会从被捕获字符的index开始

    let lastMatchIndex = 0
    while (match = defaultTagRE.exec(text)) {
        let index = match.index // 匹配的位置
        if (index > lastMatchIndex) {
            tokens.push(JSON.stringify(text.slice(lastMatchIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastMatchIndex = index + match[0].length // match[0]: {{name}}

    }
    if (lastMatchIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastMatchIndex)))
    }
    return `_v(${tokens.join('+')})`
}
function genChildren(children) {
    return children.map(child => gen(child)).join(',')
}
function codegen(ast) {
    const children = genChildren(ast.children)
    let code = `_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : null}${ast.children.length ? `,${children}` : ''})`

    return code

}
export function compileToFunction(template) {
    // 1. 将template转化成ast语法树
    const ast = parseHTML(template)

    // 2.生成render方法
    let code = codegen(ast)
    code = `with(this){return ${code}}`

    const render = new Function(code)
    // _c(div,{id:"app",style:{"background":"pink","color":"red"}},
    //    _c(p,null,_v("hello"+_s(name)+_s(age))),
    //    _c(span,{style:{"font-size":" 20px"}},_v("姓名："+_s(name))),
    //    _c(span,null,_v("年龄："+_s(age))))
    return render
}
