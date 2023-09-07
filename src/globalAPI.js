import { mergeOptions } from "./utils"

export function initGlobalAPI(Vue) {
    Vue.options = {} // 静态方法
    Vue.mixin = function (mixin) {
        // 将用户的选项和全局的options进行合并
        this.options = mergeOptions(this.options, mixin)
        return this
    }

}