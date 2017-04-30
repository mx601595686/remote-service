//用于处理对应控制器或其他远程服务发送过来的请求和事件。

import ConnectionPort from './ConnectionPort/ConnectionPort';
import RemoteServiceConnectionPort from './ConnectionPort/RemoteServiceConnectionPort';
import RunningState from './Tools/RunningState';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";
import InternalEventName from "./Tools/InternalEventName";
import SimpleEventEmiter from "./Tools/SimpleEventEmiter";

abstract class RemoteService {

    private readonly port: RemoteServiceConnectionPort;

    //是否已经关闭服务了
    private hasClosed = false;

    //关闭服务服务回调
    protected abstract onClose(): Promise<void>;

    //执行服务代码回调
    protected abstract onExecuteCode(serviceCode: string): Promise<void>;

    //接受控制器发来的其他事件
    protected onInternalMessage: (eventName: string, args: any[]) => void;

    //导入的服务
    importServices: any = {};
    //导出的服务
    exportServices: any = {};

    constructor(
        readonly serviceName: string,
        importServices: string[],
        port: ConnectionPort
    ) {
        this.port = new RemoteServiceConnectionPort(serviceName, importServices, port);

        //是否已经执行了服务代码
        let hasExecuteServiceCode = false;

        //网络连接出现错误就关闭服务
        this.port.onConnectionError = () => this.onClose();

        //当接收到内部消息
        this.port.onInternalMessage = (eventName, args) => {
            switch (eventName) {
                case InternalEventName.close: { //关闭当前服务
                    this.closeService();
                    break;
                }
                case InternalEventName.executeServiceCode: { //执行服务代码
                    if (!hasExecuteServiceCode) {
                        hasExecuteServiceCode = true;
                        if (this.onExecuteCode !== undefined) {
                            this.onExecuteCode(args[0])
                                .then(() => {
                                    this.port.sendInternalMessage(InternalEventName.runningStateChange, RunningState.running);
                                })
                                .catch((err: Error) => {
                                    this.port.sendInternalMessage(InternalEventName.remoteServiceError, { message: err.message, stack: err.stack });
                                    this.closeService();
                                });
                        } else {
                            this.port.sendInternalMessage(InternalEventName.runningStateChange, RunningState.running);
                        }
                    }
                    break;
                }
                default: {
                    this.onInternalMessage && this.onInternalMessage(eventName.toString(), args);
                    break;
                }
            }
        };

        //初始化导入的服务
        this.port.importServices.forEach((serviceName) => {
            this.importServices[serviceName] = {
                services: new Proxy(this.port.sendInvoke.bind(this.port, serviceName), {    //向对应服务发送请求
                    get(target, functionName) {
                        return target.bind(undefined, functionName);
                    }
                }),
                event: new SimpleEventEmiter()  //接受对应服务的事件
            };
        });

        //当接收到依赖服务发来的事件
        this.port.onEventMessage = (sender, eventName, args) => {
            this.importServices[sender].event.emit(eventName, ...args);
        };

        //处理远端服务调用请求
        this.port.onInvokeMessage = async (functionName, args) => {
            return await this.exportServices[functionName](...args);
        }

        //公开发送事件方法
        this.sendEvent = this.port.sendEventMessage.bind(this.port);

        //通知远端已准备好了
        setTimeout(() => {
            this.port.sendInternalMessage(InternalEventName.remoteReady);
        }, 10);
    }

    /**
     * 通知服务控制器资源消耗情况
     * 
     * @protected
     * @param {ResourceUsageInformation} state 源消耗情况
     * 
     * @memberof RemoteService
     */
    protected onUpdateResourceUsage(state: ResourceUsageInformation) {
        this.port.sendInternalMessage(InternalEventName.updateResourceUsage, state);
    }


    /**
     * 通知服务控制器出现错误,把错误发送给服务控制器
     * 
     * @protected
     * @param {Error} err 错误消息
     * 
     * @memberof RemoteService
     */
    protected sendError(err: Error) {
        this.port.sendInternalMessage(InternalEventName.remoteServiceError, { message: err.message, stack: err.stack });
    };

    /**
     * 发送标准输出内容
     * 
     * @protected
     * @param {string} out 标准输出的内容
     * 
     * @memberof RemoteService
     */
    protected sendStdout(out: string) {
        this.port.sendInternalMessage(InternalEventName.remoteStdout, Date.now(), out);
    }

    /**
     * 发送标准错误输出的内容
     * 
     * @protected
     * @param {string} out 标准错误输出
     * 
     * @memberof RemoteService
     */
    protected sendStderr(out: string) {
        this.port.sendInternalMessage(InternalEventName.remoteStderr, Date.now(), out);
    }

    /**
     * 向控制器发送事件
     * 
     * @protected
     * @param {string} eventName 事件名
     * @param {...any[]} args 参数
     * 
     * @memberOf ServiceController
     */
    protected sendInternalMessage(eventName: string, ...args: any[]) {
        //不允许发送数字类型的事件名是为了避免与内部事件名相冲突
        this.port.sendInternalMessage(eventName, args);
    }

    protected get invokeTimeout() { //获取调用超时
        return this.port.invokeTimeout;
    }

    protected set invokeTimeout(value: number) {
        if (value < 1) value = 1;
        this.port.invokeTimeout = value;
    }

    /**
     * 关闭服务
     * @memberof RemoteService
     */
    async closeService() {
        if (!this.hasClosed) {
            this.hasClosed = true;
            this.port.sendInternalMessage(InternalEventName.runningStateChange, RunningState.closing); //通知正在关闭
            if (this.onClose !== undefined) {
                try {
                    await this.onClose();  //调用关闭回调方法
                } catch (err) {
                    this.port.sendInternalMessage(InternalEventName.remoteServiceError, { message: err.message, stack: err.stack });
                }
            }
            this.port.sendInternalMessage(InternalEventName.runningStateChange, RunningState.closed);
        }
    }

    /**
     * 向其他服务发送事件
     * @memberof RemoteService
     */
    sendEvent: (eventName: string, ...args: any[]) => void;
}

export default RemoteService;