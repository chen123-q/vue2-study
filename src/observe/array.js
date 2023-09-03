const oldArrayPrototype = Array.prototype
const methods = ['push', 'unshift', 'pop', 'shift', 'splice', 'sort', 'reverse']

export const newArrayPrototype = Object.create(oldArrayPrototype)
methods.forEach(item => {
    // arr.push(1) => this === arr
    newArrayPrototype[item] = function (...args) {
        const res = oldArrayPrototype[item].call(this, ...args)
        const ob = this.__ob__
        let inserted = null
        switch (item) {

            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)

            default:
                break;
        }
        inserted && ob.observeArray(inserted)

        ob.dep.notify()
        return res
    }
})