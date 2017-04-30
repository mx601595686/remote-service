//调用远程服务方法的消息

import MessageType from './MessageType';
import Message from "./Message";

export default class InvokeMessage extends Message {
    data: { callback: string, functionName: string, args: any[] };

    /**
     * 创建一条调用消息
     * @param {string} sender 发送服务名称
     * @param {string} receiver 接受服务名称
     * @param {string} functionName 调用方法名
     * @param {*} args 参数
     * 
     * @memberOf InvokeMessage
     */
    constructor(sender: string, receiver: string, functionName: string, args: any[]) {
        super(receiver, sender, MessageType.invoke, {
            callback: Math.random().toString(),
            functionName,
            args
        });
    }
}