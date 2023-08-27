import { compileToFunction } from "./compiler"
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
        let template = opts.template
        // render > template > el
        if (!opts.render) {
            if (!opts.template && el) {
                template = el.outerHTML
            }
            if (template) {
                const render = compileToFunction(template)
            }

        }

    }
}
