/*内部消息，仅供ServiceController与RemoteService通信使用*/

import MessageType from './MessageType';
import Message from "./Message";
import ServiceController from "../ServiceController";

/*
    内部消息只发送给消息控制器
*/

export default class InternalMessage extends Message {

    data: { eventName: string | number, args: any[] };

    /**
     * 创建一条内部消息
     * @param {boolean} isController 是否是控制器，通过这个来确定发送者与接受者的名称
     * @param {string} serviceName 控制器对应远程服务的名称
     * @param {(string | number)} eventName 要触发的事件名称
     * @param {*} data 要传递的数据
     * 
     * @memberOf InternalMessage
     */
    constructor(isController: boolean, serviceName: string, eventName: string | number, args: any[]) {
        const sender = isController ? ServiceController.controllerName : serviceName;
        const receiver = isController ? serviceName : ServiceController.controllerName;
        super(receiver, sender, MessageType.internal, {
            eventName,
            args
        });
    }
}