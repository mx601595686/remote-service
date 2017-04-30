//发送事件消息

import MessageType from './MessageType';
import Message from "./Message";

export default class EventMessage extends Message {
    data: { eventName: string | number, args: any[] };

    /**
     * 创建一条事件消息
     * @param {string} sender 发送服务名称
     * @param {(string | number)} eventName 触发事件名
     * @param {*} args 参数
     * 
     * @memberOf EventMessage
     */
    constructor(sender: string, eventName: string | number, args: any[]) {
        super(undefined, sender, MessageType.event, {
            eventName,
            args
        });
    }
}