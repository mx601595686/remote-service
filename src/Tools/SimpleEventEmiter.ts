//自定义的一个消息派发器

export default class SimpleEventEmiter {

    listeners: any = {};

    on(type: string, callback: Function): void {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    }

    off(type: string, callback: Function): void {
        if (!(type in this.listeners)) {
            return;
        }
        var stack = this.listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return;
            }
        }
    }

    once(type: string, callback: Function): void {
        let one = (...args: any[]) => {
            callback(...args);
            this.off(type, one);
        }
        this.on(type, one);
    }

    emit(type: string, ...args: Array<any>) {
        if (!(type in this.listeners)) {
            return true;
        }
        var stack = this.listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(undefined, ...args);
        }
        return true;
    };
}