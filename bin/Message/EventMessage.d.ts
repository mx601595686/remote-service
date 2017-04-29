import Message from "./Message";
export default class EventMessage extends Message {
    data: {
        eventName: string;
        args: any[];
    };
    /**
     * 创建一条事件消息
     * @param {string} sender 发送服务名称
     * @param {string[]} receiver 接受服务名称
     * @param {string} eventName 触发事件名
     * @param {*} args 参数
     *
     * @memberOf EventMessage
     */
    constructor(sender: string, receiver: string[], eventName: string, args: any[]);
}
