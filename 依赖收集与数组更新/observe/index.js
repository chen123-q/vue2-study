import { newArrayPrototype } from "./array"
import Dep from "./dep"

class Observe {
    constructor(data) {
        // 给每个对象都增加收集功能
        this.dep = new Dep()

        // data.__ob__ = this // 标识
        // Object.defineProperty 只能劫持已有属性
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 不可枚举
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
function dependArray(value) {

    for (let i = 0; i < value.length; i++) {
        let current = value[i]
        if (Array.isArray(current)) {
            current.__ob__.dep.depend()
            dependArray(current)
        }
    }
}
export function defineReactive(target, key, value) {

    const childOb = observe(value) // 递归劫持 ,对所有的对象都进行属性劫持
    let dep = new Dep() // 每个属性都有一个 dep
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get() {
            if (Dep.target) {
                dep.depend() // 让这个属性的收集器记住当前的 watcher

                if (childOb) {
                    childOb.dep.depend() // 让数组和对象本身也实现依赖收集
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            if (value !== newValue) {
                value = newValue
                observe(newValue)
                dep.notify() // 通知更新
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