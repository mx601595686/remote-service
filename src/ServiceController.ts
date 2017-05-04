//服务控制器
import ConnectionPort from './ConnectionPort/ConnectionPort';
import ServiceControllerConnectionPort from './ConnectionPort/ServiceControllerConnectionPort';
import RunningState from './Tools/RunningState';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";
import InternalEventName from "./Tools/InternalEventName";
import RemoteError from "./Tools/RemoteError";

export default class ServiceController {
    static readonly controllerName = '__controller__';     //控制器的默认名称

    private readonly port: ServiceControllerConnectionPort;

    //当与远端服务连接出现异常
    onConnectionError: (err: Error) => void;
    //远端服务运行状态发生改变
    onRunningStateChange: (state: RunningState) => void;
    //当远端服务发生异常
    onRemoteServiceError: (err: Error) => void;
    //远端服务的标准输出
    onRemoteStdout: (timestamp: number, out: string) => void;
    //远端服务的标准错误输出
    onRemoteStderr: (timestamp: number, out: string) => void;
    //更新远端资源消耗情况
    onUpdateResourceUsage: (usage: ResourceUsageInformation) => void;

    //远端发来的其他事件
    protected onMessage: (eventName: string, args: any[]) => void;

    constructor(
        readonly serviceName: string,
        serviceCode: string,
        port: ConnectionPort
    ) {
        this.port = new ServiceControllerConnectionPort(serviceName, port);

        //网络连接出现异常
        this.port.onConnectionError = (err) => this.onConnectionError && this.onConnectionError(err);
        //接受远端发来的消息
        this.port.onInternalMessage = (eventName, args) => {
            switch (eventName) {
                case InternalEventName.remoteReady: {   //当远端准备好了就发送要执行的服务代码
                    this.port.sendInternalMessage(InternalEventName.executeServiceCode, serviceCode);
                    break;
                }
                case InternalEventName.remoteServiceError: {
                    this.onRemoteServiceError &&
                        this.onRemoteServiceError(new RemoteError(args[0]))
                    break;
                }
                case InternalEventName.remoteStderr: {
                    this.onRemoteStderr && this.onRemoteStderr(args[0], args[1]);
                    break;
                }
                case InternalEventName.remoteStdout: {
                    this.onRemoteStdout && this.onRemoteStdout(args[0], args[1]);
                    break;
                }
                case InternalEventName.runningStateChange: {
                    this.onRunningStateChange && this.onRunningStateChange(args[0]);
                    break;
                }
                case InternalEventName.updateResourceUsage: {
                    this.onUpdateResourceUsage && this.onUpdateResourceUsage(args[0]);
                    break;
                }
                default: {
                    this.onMessage && this.onMessage(eventName.toString(), args);
                    break;
                }
            }
        }
    }

    /**
     * 向远端发送事件
     * 
     * @protected
     * @param {string} eventName 事件名
     * @param {...any[]} args 参数
     * 
     * @memberOf ServiceController
     */
    protected sendMessage(eventName: string, ...args: any[]) {
        //不允许发送数字类型的事件名是为了避免与内部事件名相冲突
        this.port.sendInternalMessage(eventName, args);
    }

    /**
     * 通知关闭远程服务
     * @memberOf ServiceController
     */
    closeService() {
        this.port.sendInternalMessage(InternalEventName.close);
    }
}