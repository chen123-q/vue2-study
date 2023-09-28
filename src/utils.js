

const strats = {}
const LIFECYCLE = [
    'beforeCreate',
    'created',
    'beforemount',
    'mounted'
]
LIFECYCLE.forEach(hook => {

    strats[hook] = function (p, c) {
        // 第一次：{},{created:function(){}} => {created:[fn]}
        // 第二次：{created:[fn]},{created:function(){}} => {created:[fn,fn]}

        if (c) {  // 如果儿子有 
            if (p) { // 如果父亲有
                return p.concat(c) // 拼在一起
            } else {
                return [c] // 儿子有父亲没有,将儿子包装成数组
            }
        } else {
            return p
        }

    }
})

strats.components = function (parentVal, childVal) {
    const res = Object.create(parentVal)
    if (childVal) {
        for (let key in childVal) {
            res[key] = childVal[key] // 返回的是构造的对象，可以拿到父亲原型上的属性，并且将儿子的都拷贝到自己身上
        }
    }

    return res
}

export function mergeOptions(parent, child) {
    const options = {}
    for (let key in parent) { // 循环老的 {a:1}
        mergeField(key)
    }
    for (let key in child) {  // 循环新的老的循环过了新的就不循环
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
    function mergeField(key) {
        // 策略模式 
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            // 不在策略中优先采用儿子再采用父亲
            options[key] = child[key] || parent[key]
        }

    }

    return options
}