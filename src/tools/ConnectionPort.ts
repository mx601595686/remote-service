/*
 * 抽象化一个与远端连接的通信端口。通过这个类隔开了内部代码与用户外部实现，用户可以通过任何方式来与服务建立连接,来进行消息的传递。
 * 通信端口提供者必须自行处理端口端口连接后应当采取的措施
 */

import MessageData, {MessageType} from './MessageData';
import {ServiceController} from '../service/ServiceController';

abstract class ConnectionPort {

    serviceName: string; //使用该接口的服务名称
    importServices: string[];   //该服务引用的外部服务名
    _onMessage: (message: MessageData) => void;         //内部用于接受消息的回调方法

    constructor(serviceName: string, importServices: string[]) {
        this.serviceName = serviceName;
        this.importServices = [ServiceController.controllerName, ...importServices];
    }

    //内部发送消息，在发送消息前会对发送的消息进行验证
    _sendMessage(message: MessageData) {
        message.sender = this.serviceName;

        switch (message.type) {
            case MessageType.invoke: {
                if (!this.importServices.includes(message.receiver)) {  //如果请求了不在服务列表中的服务
                    this._onMessage(MessageData.prepareResponseInvoke(message,
                        new Error(`The calling service '${message.receiver}' is not in the service list`)));
                } else {
                    this.onSendMessage(message);
                }
                break;
            }
            case MessageType.response: {
                if (this.importServices.includes(message.receiver)) {   //确保只回复在服务列表中的请求
                    this.onSendMessage(message);
                }
                break;
            }
            default: {
                this.onSendMessage(message);
                break;
            }
        }
    };

    receiveMessage(message: MessageData) {
        switch (message.type) {
            case MessageType.invoke:
            case MessageType.response: {
                if (message.receiver === this.serviceName) {
                    this._onMessage(message);
                }
                break;
            }
            default: {
                this._onMessage(message);
                break;
            }
        }
    }

    abstract onSendMessage(message: MessageData): void;
}

export default ConnectionPort;