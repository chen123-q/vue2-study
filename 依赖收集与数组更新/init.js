import { mergeOptions } from "./utils"
import { compileToFunction } from "./compiler"
import { callHook, mountComponent } from "./lifecycle"
import { initState } from "./state"

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this

        // 用户定义的全局指令和过滤器... 都会挂到实例上
        vm.$options = mergeOptions(this.constructor.options, options)
        // console.log(vm.$options);

        callHook(vm, 'beforeCreate')
        // 初始化状态
        initState(vm)
        callHook(vm, 'created')
        // 挂载元素
        if (options.el) {
            vm.$mount(options.el)
        }

    }
    Vue.prototype.$mount = function (el) {
        callHook(this, 'beforeMount')
        const vm = this
        el = document.querySelector(el)
        const opts = vm.$options
        let { template } = opts
        // render > template > el
        if (!opts.render) {
            if (!template && el) {
                template = el.outerHTML
            }
            if (template) {
                const render = compileToFunction(template)
                opts.render = render // 最终的render
            }

        }
        mountComponent(vm, el) // 挂载
        callHook(vm, 'mounted')
    }
}

