
// h() _c()

const isReservenTag = (tag) => {
    return ['a', 'div', 'p', 'button', 'ul', 'li', 'span'].includes(tag)
}

export function createElementVNode(vm, tag, data, ...children) {
    data = data ?? {}
    const { key } = data
    if (key) delete data.key
    if (isReservenTag(tag)) {

        return vNode(vm, tag, key, data, children)
    } else {
        // 创建一个组件的虚拟节点
        const Ctor = vm.$options.components[tag]

        // Ctor 可能是一个Sub类，也可能是组件的obj选项
        return creatComponentVnode(vm, tag, key, data, children, Ctor)
    }
}

function creatComponentVnode(vm, tag, key, data, children, Ctor) {
    if (typeof Ctor === 'object') {
        Ctor = vm.$options._base.extend(Ctor)
    }
    data.hook = {
        init(vnode) { // 如果是组件调用此方法
            // 保存组件的实例到虚拟节点上
            let instance = vnode.componentInstance = new vnode.componentOptions.Ctor
            instance.$mount() // instance.$el
        }
    }
    return vNode(vm, tag, key, data, children, null, { Ctor })
}

// _v()
export function createTextVNode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text)

}

// ast : 语法层面的转化 描述语言本身 (可以描述 js, css, html)
// 虚拟DOM 描述虚拟dom元素，可以增加一些自定义属性
function vNode(vm, tag, key, data, children, text, componentOptions) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text,
        componentOptions // 组件的构造函数
    }
}

export function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key
}