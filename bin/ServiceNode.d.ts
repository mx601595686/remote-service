import ServiceContainer from './ServiceContainer';
export default class ServiceNode {
    readonly serviceContainer: ServiceContainer;
    private readonly onClosedCallbackList;
    private readonly onRunningCallbackList;
    readonly imports: ServiceNode[];
    readonly dependence: ServiceNode[];
    constructor(serviceContainer: ServiceContainer);
    /**
     * 关闭服务容器
     *
     * @returns {Promise<void>}
     *
     * @memberof ServiceNode
     */
    close(): Promise<void>;
    /**
     * 启动服务容器
     *
     * @returns {Promise<void>}
     *
     * @memberof ServiceNode
     */
    start(): Promise<void>;
}
