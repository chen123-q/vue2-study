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
let render1 = compileToFunction(`<ul a=1 style="color:red">
<li key = "a">a</li>
<li key = "b">b</li>
<li key = "c">c</li>
<li key = "d">d</li>
</ul>`)
let vm1 = new Vue({ data: { name: 'cx' } })
let prevVnode = render1.call(vm1)

let el = createElm(prevVnode)
document.body.appendChild(el)

let render2 = compileToFunction(`<ul  style="color:blue">
<li key = "b">b</li>
<li key = "m">m</li>
<li key = "a">a</li>
<li key = "p">p</li>
<li key = "c">c</li>
<li key = "q">q</li>

</ul>`)
let vm2 = new Vue({ data: { name: 'cx' } })
let nextVnode = render2.call(vm2)

setTimeout(() => {
    path(prevVnode, nextVnode)

}, 1000)

// diff 是一个平级比对的过程


export default Vue
