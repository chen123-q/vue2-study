import { newArrayPrototype } from "./array"

class Observe {
    constructor(data) {
        // data.__ob__ = this // 标识
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })

        if (Array.isArray(data)) {
            data.__proto__ = newArrayPrototype
            this.observeArray(data)
        } else {

            this.walk(data)
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }

    observeArray(data) {
        data.forEach(item => observe(item))
    }
}
export function defineReactive(target, key, value) {

    observe(value) // 递归处理
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get() {
            return value
        },
        set(newValue) {
            if (value !== newValue) {
                value = newValue

                observe(newValue)
            }
        }
    })
}
export function observe(data) {
    // 只劫持对象

    if (data && typeof data !== 'object') return
    // 如果这个数据上有__ob__属性说明被观测过就不需要再被劫持
    if (data.__ob__ instanceof Observe) return data.__ob__
    return new Observe(data)
}