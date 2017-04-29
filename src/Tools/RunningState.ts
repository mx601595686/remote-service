//远端的运行状态

const enum RunningState {
    starting,   //正在启动
    running,    //正在运行
    closing,    //正在关闭
    closed,     //已关闭
}

export default RunningState;