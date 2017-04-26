export default class EventEmiter {
    listeners: any;
    on(type: string, callback: Function): void;
    off(type: string, callback: Function): void;
    emit(type: string, ...args: Array<any>): boolean;
}
