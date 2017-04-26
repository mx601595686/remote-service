/*
*   基本服务的框架，
*/

import ConnectionPort from '../tools/ConnectionPort';
import MessageData, { MessageType } from "../tools/MessageData";
import RemoteInvokeError from "../tools/RemoteInvokeError";


/*
* 这个类只提供了导出服务、发送事件的能力
*/
class BasicService {

    //导出的服务
    protected readonly exportServices: any = {};
    //导出的内部服务
    protected readonly exportPrivateServices: any = {};
    //该服务的名称
    protected readonly serviceName: string;
    //连接的端口
    private readonly port: ConnectionPort;
    //回调方法列表
    private readonly callbackList: any = {};

    constructor(serviceName: string, port: ConnectionPort) {
        this.serviceName = serviceName;
        this.port = port;

        this.port.onMessage = (message) => {
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
            const message = MessageData.prepareSendInvoke(isPrivate, this.serviceName, receiver, functionName, args);
            this.callbackList[message.callback] = (err: RemoteInvokeError, data: any) => err ? reject(err) : resolve(data);
            this.port.sendMessage(message);
        });
    }

    //回复请求
    private async _responseInvoke(message: MessageData) {
        try {
            const service = message.isPrivate ? this.exportPrivateServices : this.exportServices;
            const result = await service[message.triggerName](...message.args);
            this.port.sendMessage(MessageData.prepareResponse(message, undefined, result));
        } catch (e) {
            this.port.sendMessage(MessageData.prepareResponse(message, e));
        }
    }

    //接收远端方法调用结果
    private _receiveInvoke(message: MessageData) {
        const callback = this.callbackList[message.callback];
        this.callbackList[message.callback] = undefined;
        if (callback !== undefined) {
            callback(new RemoteInvokeError(message.error), message.args);
        }
    }

    //发送事件
    protected sendEvent(isPrivate: boolean, eventName: string, ...args: any[]) {
        this.port.sendMessage(MessageData.prepareSendEvent(isPrivate, this.serviceName, eventName, args));
    }

    //接收事件
    protected _receiveEvent(message: MessageData) {
        return {
            event: message.triggerName,
            data: message.args
        }
    }
}

export default BasicService;