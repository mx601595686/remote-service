/**
 * 消息的类型
 */
export const enum MessageType {
    invoke,     //调用
    event,      //触发事件
    response    //回复调用
}

/*
*   代表一条发送的消息
*/
export default class MessageData {
    sender?: string;                            //发送者名称
    type: MessageType;                          //消息类型
    triggerName?: string;                       //要触发方法或事件的名称
    receiver?: string;                          //接受者的名称
    callback?: string;                          //如果需要回复发送者，回复消息的唯一表识
    args: any;                                  //传递的参数
    error?: { message: string, stack: string }; //调用远程方法出错
    isPrivate?: boolean;                        //是不是私有的方法或时间

    static prepareSendInvoke(isPrivate: boolean, sender: string, receiver: string, triggerName: string, args: Array<any>) {
        const result = new MessageData();

        result.isPrivate = isPrivate;
        result.sender = sender;
        result.receiver = receiver;
        result.triggerName = triggerName;
        result.args = args;

        result.callback = Math.random().toString();
        result.type = MessageType.invoke;

        return result;
    }

    static prepareResponseInvoke(invokeMessage: MessageData, err: undefined | Error, returnData?: any) {
        const result = new MessageData();

        result.callback = invokeMessage.callback;
        result.receiver = invokeMessage.sender;

        if (err !== undefined) {
            result.error = {
                message: err.message,
                stack: err.stack
            };
        } else{
            result.args = returnData;
        }

        result.type = MessageType.response;

        return result;
    }

    static prepareSendEvent(isPrivate: boolean, sender: string, triggerName: string, args: Array<any>) {
        const result = new MessageData();

        result.isPrivate = isPrivate;
        result.sender = sender;
        result.triggerName = triggerName;
        result.args = args;

        result.type = MessageType.event;

        return result;
    }
}