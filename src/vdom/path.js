import { isSameVnode } from ".";

function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) {
        i(vnode)
    }
}

// 处理属性
export function pathProps(el, oldProps, props) {
    // 老的属性（样式）中有，新的没有，要删除老的

    // 比较 style
    let oldStyle = oldProps?.style || {}
    let newStyle = props?.style || {}
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }
    // 比较属性
    for (let key in oldProps) {
        if (!props[key]) {
            el.removeAttribute(key)
        }
    }

    // 用新的覆盖老的
    for (const key in props) {
        if (key === 'style') {  // style:{color:red}
            for (const styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        } else {

            el.setAttribute(key, props[key])
        }
    }
}
export function createElm(vNode) {
    let { tag, data, children, text } = vNode;
    if (typeof tag === "string") {

        if (createComponent(vNode)) { // 组件
            return
        }


        vNode.el = document.createElement(tag); // 将真实节点和虚拟节点对应起来
        pathProps(vNode.el, {}, data)

        children.forEach((child) => {
            vNode.el.appendChild(createElm(child));
        });
    } else {
        vNode.el = document.createTextNode(text);
    }
    return vNode.el;
}

export function path(oldVNode, vNode) {
    if (!oldVNode) return createElm(vNode)// 组件的挂载

    // 初次渲染
    const isRealElement = oldVNode.nodeType;
    if (isRealElement) {
        const elm = oldVNode; // 获取真实元素
        const parentElm = elm.parentNode; // 拿到父元素

        const newElm = createElm(vNode);
        parentElm.insertBefore(newElm, elm.nextSibling) // 先插入新节点
        parentElm.removeChild(elm) // 再删除老节点

        return newElm
    } else {
        // diff算法

        return pathVnode(oldVNode, vNode)

    }
}
function pathVnode(oldVNode, vNode) {
    // 1. 两个节点不是同一个节点，用新的替换老的
    if (!isSameVnode(oldVNode, vNode)) { // tag === tag key === key
        let el = createElm(vNode)
        oldVNode.el.parentNode.replaceChild(el, oldVNode.el)
        return el
    }
    // 2. 两个节点是同一个节点（判断节点的tag和key），比较两个节点的属性是否有差异（复用老的节点，将差异的属性更新）

    //   2.1 如果是文本，比对文本的内容
    let el = vNode.el = oldVNode.el // 复用老节点的元素
    if (!oldVNode.tag) { // 如果是文本
        if (oldVNode.text !== vNode.text) {
            el.textContent = vNode.text
        }
    }

    //   2.2 如果是标签 比对标签的属性
    pathProps(el, oldVNode.data, vNode.data)


    // 3. 父亲比对完，比对儿子
    // 比对儿子   

    let oldChildren = oldVNode.children || []
    let newChildren = vNode.children || []

    if (oldChildren.length > 0 && newChildren.length > 0) {

        // 3.1 完整的diff算法 两方都有儿子 比较新老节点的儿子
        updateChildren(el, oldChildren, newChildren)


        // 3.2 一方有儿子 一方没有儿子
    } else if (newChildren.length > 0) { // 老的没有，新的有 添加新的


        mountChildren(el, newChildren)

    } else if (oldChildren.length > 0) {// 老的有，新的没有 删除老的


        el.innerHTML = '' // 可以循环删除
    }
    return el
}

function mountChildren(el, newChildren) {
    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        el.appendChild(createElm(child))

    }
}

function updateChildren(el, oldChildren, newChildren) {
    // v2双指针 比较两个节点
    // 操作节点通常会是 push shift pop unshift reverse sort 这些方法

    let oldStartIndex = 0
    let newStartIndex = 0
    let oldEndIndex = oldChildren.length - 1
    let newEndIndex = newChildren.length - 1

    let oldStartVnode = oldChildren[0]
    let newStartVnode = newChildren[0]
    let oldEndVnode = oldChildren[oldEndIndex]
    let newEndVnode = newChildren[newEndIndex]

    function makeIndexByKey(children) {
        let map = {}
        children.forEach((child, index) => {
            map[child.key] = index
        })
        return map
    }
    let map = makeIndexByKey(oldChildren)

    // 双方有一方头指针大于尾指针就停止循环
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {

        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex]
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
        } else if (isSameVnode(oldStartVnode, newStartVnode)) { // 头头比对 从前往后比 push abc => abcd
            // 如果是相同节点，递归比较子节点
            pathVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]

        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            // 尾尾比对 从后往前比 unshift bcd => abcd
            pathVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]

        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // 老尾新头 交叉比对 abcd => dabc
            pathVnode(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            // 将老的尾巴移动到老的前面
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]

        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // 老头新尾 abcd => dcba
            pathVnode(oldStartVnode, newEndVnode)

            // insertBefore 具备移动性 会将原来的元素移走
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]

        } else {

            // 乱序比对
            // 根据老的列表做一个映射关系，用新的去找，找到则移动，找不到则添加，最后多余的删除

            let moveIndex = map[newStartVnode.key] // 如果拿到说明是要移动的索引
            if (moveIndex) {
                let moveVnode = oldChildren[moveIndex] // 找到对应的虚拟节点复用
                el.insertBefore(moveVnode.el, oldStartVnode.el)
                oldChildren[moveIndex] = undefined // 表示这个节点已经被移走了
                pathVnode(moveVnode, newStartVnode)
            } else {
                el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            }
            newStartVnode = newChildren[++newStartIndex]
        }


    }

    // 多余的新的插入
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i < newChildren.length; i++) {
            const childEl = createElm(newChildren[i])
            // el.appendChild(childEl)

            // 这里可能是向后追加也可能是向前追加
            const next = newChildren[newEndIndex + 1]
            const anchor = next ? next.el : null
            el.insertBefore(childEl, anchor) // anchor 为null 会认为是appendChild

        }

    }

    // 多余的老的删除
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldChildren[i]) {

                let childEl = oldChildren[i].el
                el.removeChild(childEl)
            }
        }
    }

}