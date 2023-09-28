import { mergeOptions } from "./utils"

export function initGlobalAPI(Vue) {
    Vue.options = {
        _base: Vue
    } // 静态方法
    Vue.mixin = function (mixin) {
        // 将用户的选项和全局的options进行合并
        this.options = mergeOptions(this.options, mixin)
        return this
    }

    Vue.extend = function (options) {
        function Sub(options = {}) { // 最终使用一个组件 就是new 一个实例
            this._init(options)
        }
        Sub.prototype = Object.create(Vue.prototype)
        Sub.prototype.constructor = Sub
        Sub.options = mergeOptions(Vue.options, options)
        return Sub
    }

    Vue.options.components = {}
    Vue.component = function (id, definition) {
        // 如果 definition 是一个函数说明用户自己调用了 Vue.extend
        definition = typeof definition === "function" ? definition : Vue.extend(definition)
        Vue.options.components[id] = definition

    }

}