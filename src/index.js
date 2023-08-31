import { initMixin } from "./init.js"
import { initLifeCycle } from "./lifecycle.js"

function Vue(options) {
    this._init(options)
}
initMixin(Vue)

initLifeCycle(Vue)

export default Vue

// test