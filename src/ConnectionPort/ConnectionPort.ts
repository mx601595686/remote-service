//通信连接端口，统一收发消息接口的样式。

import Message from "../Message/Message";

abstract class ConnectionPort {
    //供该库内部代码设置的消息接受回调函数
    onMessage: (message: Message) => void;
    
    //供该库内部代码设置的网络异常回调函数。
    onError: (err: Error) => void;
    
    //内部向外部发送消息
    abstract sendMessage(message: Message): void;
}

export default ConnectionPort;