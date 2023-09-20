import { isSameVnode } from ".";

// 处理属性
export function pathProps(el, oldProps, props) {
    // 老的属性（样式）中有，新的没有，要删除老的

    // 比较 style
    let oldStyle = oldProps.style || {}
    let newStyle = props.style || {}
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
    } else if (newChildren.length > 0) { // 没有老的，有新的 添加


        mountChildren(el, newChildren)

    } else if (oldChildren.length > 0) {// 有老的，没有新的 删除


        el.innerHTML = '' // 可以循环删除
    }
    console.log(oldChildren, newChildren);
    return el
}

function mountChildren(el, newChildren) {
    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        el.appendChild(createElm(child))

    }

}

function updateChildren(el, oldChildren, newChildren) {
    // 双指针

    let oldStartIndex = 0
    let newStartIndex = 0
    let oldEndIndex = oldChildren.length - 1
    let newEndIndex = newChildren.length - 1

    let oldStartVnode = oldChildren[0]
    let newStartVnode = newChildren[0]
    let oldEndVnode = oldChildren[oldEndIndex]
    let newEndVnode = newChildren[newEndIndex]


    console.log(el, oldChildren, newChildren)
}