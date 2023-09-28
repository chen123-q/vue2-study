
// h() _c()

export function createElementVNode(vm, tag, data, ...children) {
    data = data ?? {}
    let { key } = data
    if (key) delete data.key
    return vNode(vm, tag, key, data, children)
}


// _v()
export function createTextVNode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text)

}

// ast : 语法层面的转化 描述语言本身 (可以描述 js, css, html)
// 虚拟DOM 描述虚拟dom元素，可以增加一些自定义属性
function vNode(vm, tag, key, data, children, text) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}