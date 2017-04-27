import MessageData from './MessageData';
declare abstract class ConnectionPort {
    serviceName: string;
    importServices: string[];
    /**
     *
     * @param {string} serviceName 使用该接口的服务名称
     * @param {string[]} importServices 该服务引用的外部服务名
     *
     * @memberOf ConnectionPort
     */
    constructor(serviceName: string, importServices: string[]);
    _onMessage: (message: MessageData) => void;
    _sendMessage(message: MessageData): void;
    receiveMessage(message: MessageData): void;
    abstract onSendMessage(message: MessageData): void;
}
export default ConnectionPort;
