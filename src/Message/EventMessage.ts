//发送事件消息

import MessageType from './MessageType';
import Message from "./Message";

/*
事件消息是发送给所有依赖该服务的服务的，所以没有接收者
*/

export default class EventMessage extends Message {
    data: {
        eventName: string | number, //要触发的事件名称
        args: any[] //传递的参数数组
    };

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