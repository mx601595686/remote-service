import ConnectionPort from './ConnectionPort/ConnectionPort';
import RunningState from './Tools/RunningState';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";
export default class ServiceController {
    readonly serviceName: string;
    static readonly controllerName: string;
    private readonly port;
    onConnectionError: (err: Error) => void;
    onRunningStateChange: (state: RunningState) => void;
    onRemoteServiceError: (err: Error) => void;
    onRemoteStdout: (timestamp: number, out: string) => void;
    onRemoteStderr: (timestamp: number, out: string) => void;
    onUpdateResourceUsage: (usage: ResourceUsageInformation) => void;
    protected onMessage: (eventName: string, args: any[]) => void;
    constructor(serviceName: string, serviceCode: string, port: ConnectionPort);
    /**
     * 向远端发送事件
     *
     * @protected
     * @param {string} eventName 事件名
     * @param {...any[]} args 参数
     *
     * @memberOf ServiceController
     */
    protected sendMessage(eventName: string, ...args: any[]): void;
    /**
     * 通知关闭远程服务
     * @memberOf ServiceController
     */
    closeService(): void;
}
