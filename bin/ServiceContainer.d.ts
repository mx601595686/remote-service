import ServiceController from './ServiceController';
import RunningState from './Tools/RunningState';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";
import SimpleEventEmiter from './Tools/SimpleEventEmiter';
declare abstract class ServiceContainer extends SimpleEventEmiter {
    readonly serviceName: string;
    readonly serviceCode: string;
    readonly importServices: string[];
    private controller;
    private close_time_out;
    runningState: RunningState;
    errors: Error[];
    stdout: {
        type: number;
        timestamp: number;
        content: string;
    }[];
    maxStdout: number;
    closeTimeout: number;
    resourceUsage: ResourceUsageInformation;
    constructor(serviceName: string, serviceCode: string, importServices: string[], config: any);
    /**
     * 创建服务的执行环境，记得把服务名称、服务依赖列表发过去
     *
     * @abstract
     * @returns {ServiceController}
     *
     * @memberof ServiceContainer
     */
    protected abstract onCreateEnvironment(): Promise<ServiceController>;
    /**
     * 销毁服务环境
     *
     * @protected
     * @abstract
     * @returns {Promise<void>}
     *
     * @memberof ServiceContainer
     */
    protected abstract onDestroyEnvironment(): Promise<void>;
    /**
     * 启动服务
     *
     * @memberof ServiceContainer
     */
    start(): Promise<void>;
    /**
     * 关闭服务
     *
     * @memberof ServiceContainer
     */
    close(): void;
    /**
     * 强行关闭服务
     *
     * @memberof ServiceContainer
     */
    forceClose(): Promise<void>;
}
export default ServiceContainer;
