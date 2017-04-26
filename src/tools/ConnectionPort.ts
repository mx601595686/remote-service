/*
* 抽象化一个与远端连接的通信端口。通过这个类隔开了内部代码与用户外部实现，用户可以通过任何方式来与服务建立连接,来进行消息的传递。
* 通信端口提供者必须自行处理端口端口连接后应当采取的措施
*/

import MessageData from './MessageData';

abstract class ConnectionPort {
    abstract sendMessage(message: MessageData): void;  //发送消息
    onMessage: (message: MessageData) => void;         //接受消息
}

export default ConnectionPort;