
enum MessageType{
    internal,   //服务控制器与远端服务之间传递的信息
    event,      //服务发出的事件消息
    invoke,     //服务发出调用请求
    response,   //响应调用请求
}

export default MessageType;