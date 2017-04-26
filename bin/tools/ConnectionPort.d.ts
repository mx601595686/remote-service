import MessageData from './MessageData';
declare abstract class ConnectionPort {
    abstract sendMessage(message: MessageData): void;
    onMessage: (message: MessageData) => void;
}
export default ConnectionPort;
