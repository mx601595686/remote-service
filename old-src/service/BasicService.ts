/*
*   基本服务的框架，
*/

import ConnectionPort from '../tools/ConnectionPort';
import MessageData, { MessageType } from "../tools/MessageData";
import RemoteInvokeError from "../tools/RemoteInvokeError";


/*
* 这个类只提供了导出服务、发送事件的能力
*/
abstract class BasicService {

    //导出的服务
    protected readonly exportServices: any = {};
    //导出的内部服务
    protected readonly exportPrivateServices: any = {};
    //连接的端口
    private readonly port: ConnectionPort;
    //回调方法列表
    private readonly callbackList: any = {};

    constructor(port: ConnectionPort) {
        this.port = port;

        this.port._onMessage = (message) => {
            switch (message.type) {
                case MessageType.invoke:
                    this._responseInvoke(message);
                    break;
                case MessageType.response:
                    this._receiveInvoke(message);
                    break;
                case MessageType.event:
                    this._receiveEvent(message);
                    break;
            }
        }
    }

    //调用远程请求
    protected sendInvoke(isPrivate: boolean, receiver: string, functionName: string, ...args: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const message = MessageData.prepareSendInvoke(isPrivate, receiver, functionName, args);
            this.callbackList[message.callback] = (err: RemoteInvokeError, data: any) => err ? reject(err) : resolve(data);
            this.port._sendMessage(message);
        });
    }

    //回复请求
    private async _responseInvoke(message: MessageData) {
        try {
            const service = message.isPrivate ? this.exportPrivateServices : this.exportServices;
            const result = await service[message.triggerName](...message.args);
            this.port._sendMessage(MessageData.prepareResponseInvoke(message, undefined, result));
        } catch (e) {
            this.port._sendMessage(MessageData.prepareResponseInvoke(message, e));
        }
    }

    //接收远端方法调用结果
    private _receiveInvoke(message: MessageData) {
        const callback = this.callbackList[message.callback];
        this.callbackList[message.callback] = undefined;
        if (callback !== undefined) {
            const err = message.error && new RemoteInvokeError(message.error);
            callback(err, message.args);
        }
    }

    //发送事件
    protected sendEvent(isPrivate: boolean, eventName: string, ...args: any[]) {
        this.port._sendMessage(MessageData.prepareSendEvent(isPrivate, eventName, args));
    }

    //接收事件
    protected abstract _receiveEvent(message: MessageData): void;
}

export default BasicService;