import Dep from "./dep";

let id = 0;

// 1) 当创建渲染 watcher的时候我们会把当前的渲染watcher放到Dep.target上
// 1) 调用 _render()会取值 走到 get 上

// 每个属性有一个dep (属性就是被观察者),watcher就是被观察者（属性变化了会通知观察者来更新）

class Watcher {
    // 不同组件有不同的watcher
    constructor(vm, fn, options) {
        this.id = id++;

        this.renderWatcher = options; // 是一个渲染 watcher
        this.getter = fn; // 调用这个函数可以发生取值操作
        this.deps = []; // 后续实现计算属性，和一些清理工作需要用到
        this.depsId = new Set();
        this.get();
    }
    addDep(dep) {
        // 一个组件对应着多个属性 重复的属性也不用记录
        const { id } = dep;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this); // watchet 已经记住了dep而且去重了，此时 dep也记住了watcher
        }
    }
    get() {
        Dep.target = this; // 静态属性 =>只有一份
        this.getter(); // 会去vm上取值  vm._update(vm._render())
        Dep.target = null;
    }
    update() {
        // this.get()
        queueWatcher(this);
    }

    run() {
        // console.log("update");
        this.get();
    }
}



let queue = [];
let has = {};
let pending = false;
function flushSchedulerQueue() {
    const flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach((w) => w.run());
}
// 多次更新的watcher 去重放进队列中
function queueWatcher(watcher) {
    const { id } = watcher;
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
    }
    if (!pending) {
        // 不管update执行多少次，最终只执行一次刷新操作
        nextTick(flushSchedulerQueue, 0);
        pending = true;
    }
}
let callBacks = [];
let waiting = false;
function flushCallBack() {
    let cbs = callBacks.slice(0);
    callBacks = [];
    waiting = false;
    cbs.forEach((cb) => cb());
}

// nextTick 采用优雅降级到方式
// 内部先采用promise (ie不支持) -> MutationObserver(h5) -> setImmediate(ie专享) ->setTimeout

let timeFnc;
if (Promise) {
    timeFnc = () => {
        Promise.resolve().then(flushCallBack);
    };
} else if (MutationObserver) {
    const _observe = new MutationObserver(flushCallBack)
    const textNode = document.createTextNode(1)
    _observe.observe(textNode, {
        characterData: true
    })
    timeFnc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) {
    timeFnc = () => {
        setImmediate(flushCallBack)
    }
} else {
    timeFnc = () => {
        setTimeout(flushCallBack)
    }
}

export function nextTick(cb) {
    callBacks.push(cb); // 维护nextTick中的异步方法

    if (!waiting) {
        timeFnc();
        // Promise.resolve().then(flushCallBack);
        waiting = true;
    }
}
// 需要给每个属性增加一个dep,目的是收集watcher

// 一个组件中有多个属性 （n个属性会对应一个视图） n个dep对应一个watcher
// 1个属性对应多个组件 1 个dep对应多个 watcher
// 多对多的关系

export default Watcher;
