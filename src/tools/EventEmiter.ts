//自定义的一个消息派发器
export default class EventEmiter {

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

    emit(type: string, ...args: Array<any>) {
        if (!(type in this.listeners)) {
            return true;
        }
        var stack = this.listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(undefined, type, ...args);
        }
        return true;
    };
}