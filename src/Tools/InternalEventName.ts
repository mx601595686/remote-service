//内部服务的名称

const enum InternalEventName {
    remoteReady,        //远端向控制器报告，准备完毕
    executeServiceCode, //控制器通知远端，执行服务代码
    close,              //控制器通知远端，关闭服务
    runningStateChange, //远端通知控制器，服务运行状态发生改变
    remoteServiceError, //远端服务通知控制器，发生异常
    remoteStdout,       //远端服务向控制器发送，标准输出
    remoteStderr,       //远端服务向控制器发送，标准错误输出
    updateResourceUsage //远端服务向控制器报告，资源消耗情况
}

export default InternalEventName;