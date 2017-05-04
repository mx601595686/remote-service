import ConnectionPort from './ConnectionPort/ConnectionPort';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";
declare abstract class RemoteService {
    readonly serviceName: string;
    private readonly port;
    private hasClosed;
    protected abstract onClose(): Promise<void>;
    protected abstract onExecuteCode(serviceCode: string): Promise<void>;
    protected onInternalMessage: (eventName: string, args: any[]) => void;
    importServices: any;
    exportServices: any;
    constructor(serviceName: string, importServices: string[], port: ConnectionPort);
    /**
     * 通知服务控制器资源消耗情况
     *
     * @protected
     * @param {ResourceUsageInformation} state 源消耗情况
     *
     * @memberof RemoteService
     */
    protected onUpdateResourceUsage(state: ResourceUsageInformation): void;
    /**
     * 通知服务控制器出现错误,把错误发送给服务控制器
     *
     * @protected
     * @param {Error} err 错误消息
     *
     * @memberof RemoteService
     */
    protected sendError(err: Error): void;
    /**
     * 发送标准输出内容
     *
     * @protected
     * @param {string} out 标准输出的内容
     *
     * @memberof RemoteService
     */
    protected sendStdout(out: string): void;
    /**
     * 发送标准错误输出的内容
     *
     * @protected
     * @param {string} out 标准错误输出
     *
     * @memberof RemoteService
     */
    protected sendStderr(out: string): void;
    /**
     * 向控制器发送事件
     *
     * @protected
     * @param {string} eventName 事件名
     * @param {...any[]} args 参数
     *
     * @memberOf ServiceController
     */
    protected sendInternalMessage(eventName: string, ...args: any[]): void;
    protected invokeTimeout: number;
    /**
     * 关闭服务
     * @memberof RemoteService
     */
    closeService(): Promise<void>;
    /**
     * 向其他服务发送事件
     * @memberof RemoteService
     */
    sendEvent: (eventName: string, ...args: any[]) => void;
}
export default RemoteService;
