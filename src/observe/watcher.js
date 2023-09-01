import Dep from "./dep"

let id = 0

// 1) 当创建渲染 watcher的时候我们会把当前的渲染watcher放到Dep.target上
// 1) 调用 _render()会取值 走到 get 上

// 每个属性有一个dep (属性就是被观察者),watcher就是被观察者（属性变化了会通知观察者来更新）

class Watcher { // 不同组件有不同的watcher
    constructor(vm, fn, options) {
        this.id = id++

        this.renderWatcher = options // 是一个渲染 watcher
        this.getter = fn // 调用这个函数可以发生取值操作
        this.deps = [] // 后续实现计算属性，和一些清理工作需要用到
        this.depsId = new Set()
        this.get()
    }
    addDep(dep) { // 一个组件对应着多个属性 重复的属性也不用记录
        let { id } = dep
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this) // watchet 已经记住了dep而且去重了，此时 dep也记住了watcher
        }
    }
    get() {
        Dep.target = this // 静态属性 =>只有一份
        this.getter() // 会去vm上取值  vm._update(vm._render())
        Dep.target = null
    }
    update() {
        console.log('update');
        this.get()
    }

}


// 需要给每个属性增加一个dep,目的是收集watcher


// 一个组件中有多个属性 （n个属性会对应一个视图） n个dep对应一个watcher
// 1个属性对应多个组件 1 个dep对应多个 watcher
// 多对多的关系

export default Watcher