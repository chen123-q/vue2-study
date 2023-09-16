import { initGlobalAPI } from "./globalAPI.js"
import { initMixin } from "./init.js"
import { initLifeCycle } from "./lifecycle.js"
import Watcher, { nextTick } from "./observe/watcher.js"

function Vue(options) {
    this._init(options)
}

Vue.prototype.$nextTick = nextTick
initMixin(Vue)

initLifeCycle(Vue)

initGlobalAPI(Vue)


// 最终调用的都是这个方法
Vue.prototype.$watch = function (exprOrFn, cb, options = {}) {
    // lastName
    // ()=>lastName

    // lastName的值变化了，直接调用cb函数即可
    new Watcher(this, exprOrFn, { user: true }, cb)
}








export default Vue

// test