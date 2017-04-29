export default class SimpleEventEmiter {
    listeners: any;
    on(type: string, callback: Function): void;
    off(type: string, callback: Function): void;
    once(type: string, callback: Function): void;
    emit(type: string, ...args: Array<any>): boolean;
}
