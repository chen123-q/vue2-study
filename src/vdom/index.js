
// h() _c()

export function createElementVode(vm, tag, data = {}, ...children) {
    let { key } = data
    if (key) delete data.key
    return vNode(vm, tag, key, data, children)
}


// _v()
export function createTextVode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text)

}

// ast : 语法层面的转化 描述语言本身
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