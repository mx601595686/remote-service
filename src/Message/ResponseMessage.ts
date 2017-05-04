//响应远端服务请求

import MessageType from './MessageType';
import Message from "./Message";
import InvokeMessage from "./InvokeMessage";


export default class ResponseMessage extends Message {
    data: {
        callback: string,   //调用请求发来的回调ID
        error: { message: string, stack: string },  //如果执行错误，返回给调用方的错误消息，没错则为空
        returnData: any //返回的数据
    };

    /**
     * 创建一条回复调用消息
     * @param {InvokeMessage} invokeMessage 调用消息
     * @param {string} sender 发送者名称
     * @param {Error} err 错误信息
     * @param {*} [returnData] 返回数据 
     * 
     * @memberOf ResponseMessage
     */
    constructor(invokeMessage: InvokeMessage, sender: string, err: Error, returnData?: any) {
        super(invokeMessage.sender, sender, MessageType.response, {
            callback: invokeMessage.data.callback,
            error: { message: err.message, stack: err.stack },
            returnData
        });
    }
}