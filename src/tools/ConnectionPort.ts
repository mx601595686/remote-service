/*
* 抽象化一个与远端连接的通信端口。通过这个类隔开了内部代码与用户外部实现，用户可以通过任何方式来与服务建立连接,来进行消息的传递。
* 通信端口提供者必须自行处理端口端口连接后应当采取的措施
*/

import MessageData, { MessageType } from './MessageData';
import { ServiceController } from '../service/ServiceController';

abstract class ConnectionPort {

    /**
     * 
     * @param {string} serviceName 使用该接口的服务名称
     * @param {string[]} importServices 该服务引用的外部服务名
     * 
     * @memberOf ConnectionPort
     */
    constructor(
        public serviceName: string,
        public importServices: string[]) {
        importServices.push(ServiceController.controllerName);
    }

    _onMessage: (message: MessageData) => void;         //接受消息

    //内部发送消息，在发送消息前会对发送的消息进行验证
    _sendMessage(message: MessageData) {
        message.sender = this.serviceName;
        if (!this.importServices.includes(message.receiver)) {
            if (message.type === MessageType.invoke) {
                this._onMessage(MessageData.prepareResponseInvoke(message,
                    new Error(`The calling service '${message.receiver}' is not in the service list`)));
            }
        } else {
            this.onSendMessage(message);
        }
    };

    receiveMessage(message: MessageData) {
        if (message.receiver === this.serviceName) {
            this._onMessage(message);
        }
    }

    abstract onSendMessage(message: MessageData): void;
}

export default ConnectionPort;