import Message from "./Message";
export default class InternalMessage extends Message {
    data: {
        eventName: string;
        args: any[];
    };
    /**
     * 创建一条内部消息
     * @param {boolean} isController 是否是控制器，通过这个来确定发送者与接受者的名称
     * @param {string} serviceName 控制器对应远程服务的名称
     * @param {string} eventName 要触发的事件名称
     * @param {*} data 要传递的数据
     *
     * @memberOf InternalMessage
     */
    constructor(isController: boolean, serviceName: string, eventName: string, args: any[]);
}
