import Message from "../Message/Message";
declare abstract class ConnectionPort {
    onMessage: (message: Message) => void;
    onError: (err: Error) => void;
    abstract sendMessage(message: Message): void;
}
export default ConnectionPort;
