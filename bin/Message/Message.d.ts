import MessageType from './MessageType';
export default class Message {
    readonly receiver: string[];
    readonly sender: string;
    readonly type: MessageType;
    readonly data: any;
    constructor(receiver: string[], sender: string, type: MessageType, data: any);
}
