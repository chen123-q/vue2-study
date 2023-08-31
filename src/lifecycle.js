import { createElementVode, createTextVode } from "./vdom"

export function initLifeCycle(Vue) {
    Vue.prototype._update = function () {

    }
    Vue.prototype._c = function () {
        return createElementVode(this, ...arguments)

    }
    Vue.prototype._v = function () {
        return createTextVode(this, ...arguments)

    }
    Vue.prototype._s = function (value) {
        return JSON.stringify(value)

    }
    Vue.prototype._render = function () {
        this.$options.render.call(this)

    }
}


export function mountComponent(vm, el) {
    // 1.调用render方法产生虚拟节点 虚拟DOM

    vm._update(vm._render())
    // 2.根据虚拟DOM生成真实DOM

    // 3.插入到el元素中
}

// 核心流程
// 1.创建响应式数据
// 2.模板转换成ast语法树
// 3.将ast语法树转换成render函数
// 4.后续每次更新数据只执行render函数
