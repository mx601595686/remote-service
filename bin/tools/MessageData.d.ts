/**
 * 消息的类型
 */
export declare enum MessageType {
    invoke = 0,
    event = 1,
    response = 2,
}
export default class MessageData {
    sender?: string;
    type: MessageType;
    triggerName?: string;
    receiver?: string;
    callback?: string;
    args: any;
    error?: {
        message: string;
        stack: string;
    };
    isPrivate?: boolean;
    static prepareSendInvoke(isPrivate: boolean, receiver: string, triggerName: string, args: Array<any>): MessageData;
    static prepareResponseInvoke(invokeMessage: MessageData, err: undefined | Error, returnData?: any): MessageData;
    static prepareSendEvent(isPrivate: boolean, triggerName: string, args: Array<any>): MessageData;
}
