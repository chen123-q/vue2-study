import { compileToFunction } from "./compiler"
import { mountComponent } from "./lifecycle"
import { initState } from "./state"

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options

        initState(vm)
        // 挂载元素
        if (options.el) {
            vm.$mount(options.el)
        }

    }
    Vue.prototype.$mount = function (el) {
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
    }
}

