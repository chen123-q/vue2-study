import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom";
import { path } from "./vdom/path";



export function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
        // 将vnode转化成真实dom
        const vm = this;
        const el = vm.$el;

        const prevVnode = vm._vnode
        vm._vnode = vnode // 把组件第一次产生的虚拟节点保存到 _vnode上

        if (prevVnode) {
            // updates
            vm.$el = path(prevVnode, vnode)
        } else {
            // initial render
            vm.$el = path(el, vnode);
        }

    };
    // _c(div,{id:"app",style:{"background":"pink","color":"red"}},
    //    _c(p,null,_v("hello"+_s(name)+_s(age))),
    //    _c(span,{style:{"font-size":" 20px"}},_v("姓名："+_s(name))),
    //    _c(span,null,_v("年龄："+_s(age))))
    Vue.prototype._c = function () {
        return createElementVNode(this, ...arguments);
    };
    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments);
    };
    Vue.prototype._s = function (value) {
        return typeof value === "object" ? JSON.stringify(value) : value;
    };
    Vue.prototype._render = function () {
        // 当渲染的时候会去实例中取值，我们就可以将属性和视图绑定在一起
        return this.$options.render.call(this); // 通过 ast 语法树转义后的 render
    };
}

export function mountComponent(vm, el) {
    // el是通过 querySelector 获取的
    vm.$el = el;
    // 1.调用 render 方法产生虚拟节点 虚拟DOM
    // 2.根据虚拟DOM生成真实DOM
    // 3.插入到 el 元素中

    const updateComponent = () => {

        vm._update(vm._render());
    }
    new Watcher(vm, updateComponent, true) // true 用于标识是一个渲染 watcher

}

// 核心流程
// 1.创建响应式数据
// 2.模板转换成ast语法树
// 3.将ast语法树转换成render函数
// 4.后续每次更新数据只执行render函数





export function callHook(vm, hook) { // 调用钩子函数
    const handlers = vm.$options[hook]
    if (handlers) {
        handlers.forEach(handler => handler.call(vm))
    }
}