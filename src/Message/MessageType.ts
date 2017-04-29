
enum MessageType{
    internal,   //服务控制器与远端服务通信
    event,      //服务发出的事件消息
    invoke,     //服务发出调用请求
    response,   //响应服务发出的请求
}

export default MessageType;