import { compileToFunction } from "./compiler/index.js"
import { initGlobalAPI } from "./globalAPI.js"
import { initMixin } from "./init.js"
import { initLifeCycle } from "./lifecycle.js"
import { initStateMixin } from "./state.js"
import { createElm, path } from "./vdom/path.js"

function Vue(options) {
    this._init(options)
}


initMixin(Vue)

initLifeCycle(Vue) // vm_updata vm._render

initGlobalAPI(Vue)

initStateMixin(Vue) // nextTick $watch

/************** 测试 vDom **************/
let render1 = compileToFunction(`<div kye="a" a=1 style="color:red">{{name}}</div>`)
let vm1 = new Vue({ data: { name: 'cx' } })
let prevVnode = render1.call(vm1)

let el = createElm(prevVnode)
document.body.appendChild(el)

let render2 = compileToFunction(`<div kye="a"  style="color:blue">{{name}}</div>`)
let vm2 = new Vue({ data: { name: 'cx' } })
let nextVnode = render2.call(vm2)

setTimeout(() => {
    path(prevVnode, nextVnode)

}, 1000)

// diff 是一个平级比对的过程


export default Vue
