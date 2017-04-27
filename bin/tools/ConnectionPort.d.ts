import MessageData from './MessageData';
declare abstract class ConnectionPort {
    serviceName: string;
    importServices: string[];
    _onMessage: (message: MessageData) => void;
    constructor(serviceName: string, importServices: string[]);
    _sendMessage(message: MessageData): void;
    receiveMessage(message: MessageData): void;
    abstract onSendMessage(message: MessageData): void;
}
export default ConnectionPort;
