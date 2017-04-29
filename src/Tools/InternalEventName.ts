//内部服务的名称

const enum InternalEventName {
    remoteReady,        //远端准备完毕
    executeServiceCode, //通知远端执行服务代码
    close,              //关闭远端服务
    runningStateChange, //远端服务运行状态发生改变
    remoteServiceError, //当远端服务发生异常
    remoteStdout,       //远端服务的标准输出
    remoteStderr,       //远端服务的标准错误输出
    updateResourceUsage //更新远端资源消耗情况
}

export default InternalEventName;