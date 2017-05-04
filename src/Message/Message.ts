//服务消息的基本格式
import MessageType from './MessageType';

export default class Message {
    constructor(
        public readonly receiver: string, //消息的接受者
        public readonly sender: string, //消息的发送者
        public readonly type: MessageType,  //消息类型
        public readonly data: any,  //发送的数据
    ) { }
}