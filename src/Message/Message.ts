//服务消息的基本格式
import MessageType from './MessageType';

export default class Message {
    constructor(
        public readonly receiver: string[], //消息的接受者
        public readonly sender: string,
        public readonly type: MessageType,
        public readonly data: any,
    ) { }
}