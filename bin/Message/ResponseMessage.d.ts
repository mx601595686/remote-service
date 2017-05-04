import Message from "./Message";
import InvokeMessage from "./InvokeMessage";
export default class ResponseMessage extends Message {
    data: {
        callback: string;
        error: {
            message: string;
            stack: string;
        };
        returnData: any;
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
    constructor(invokeMessage: InvokeMessage, sender: string, err: Error, returnData?: any);
}
