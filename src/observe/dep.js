

let id = 0
class Dep {
    constructor() {
        this.id = id++ // 属性的 dep 要收集 watcher
        this.subs = [] // 这里存放着当前属性对应的 watcher 有哪些
    }
    depend() {
        // {{name}} {{age}} {{name}}会放三次 但不希望放重复的 watcher
        // watcher 记录 dep
        // this.subs.push(Dep.target)


        // 让 watcher 记住 dep
        Dep.target.addDep(this) // Dep.target ===watcher
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }

    notify() {
        this.subs.forEach(wc => wc.update())
    }
}

Dep.target = null
export default Dep