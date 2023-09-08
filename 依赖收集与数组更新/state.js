import { observe } from "./observe/index"

export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
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