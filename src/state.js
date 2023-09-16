import { observe } from "./observe/index"
import Watcher from './observe/watcher'
import Dep from "./observe/dep"
export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }

    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initWatch(vm) {
    const { watch } = vm.$options // 字符串 数组 函数
    for (let key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatch(vm, key, handler[i])
            }
        } else {
            createWatch(vm, key, handler)
        }
    }
}


function createWatch(vm, key, handler) {
    // 字符串 函数
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(key, handler)

}
// this.$data.name => this.name
function proxy(vm, data) {
    Object.keys(data).forEach(key => {
        Object.defineProperty(vm, key, {
            configurable: true,
            enumerable: true,
            get() {
                return data[key]
            },
            set(newValue) {
                if (newValue !== data[key]) {
                    data[key] = newValue
                    observe(newValue)
                }
            }
        })
    });
}

function initData(vm) {
    let { data } = vm.$options
    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data

    proxy(vm, data)
    observe(data)
}

function initComputed(vm) {
    const { computed } = vm.$options

    const watchers = vm._computedWatchers = {} // 将计算属性watcher保存到vm上
    for (let key in computed) {
        let userDef = computed[key]

        // 监控 computed 中 get 的变化
        const fn = typeof userDef === 'function' ? userDef : userDef.get

        // 将属性和watcher对应
        watchers[key] = new Watcher(vm, fn, { lazy: true })// lazy 懒执行
        defineComputed(vm, key, userDef)
    }
}

function defineComputed(target, key, userDef) {
    // const getter = typeof userDef === 'function' ? userDef : userDef.get
    const setter = userDef.set ?? (() => { })
    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter,
    })
}
// 计算属性根本不会收集依赖，只会让自己的依赖属性去收集依赖
function createComputedGetter(key) {
    return function () {
        const watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            // 如果是脏的就去执行用户传入的函数
            watcher.evaluate() // 求值后dirty变为false,下次就不求了
        }
        // 计算属性出栈后还有渲染watcher 让计算属性watcher里面的属性也去收集上一层 watcher
        if (Dep.target) {
            watcher.depend()
        }
        return watcher.value
    }
}