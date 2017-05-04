import ServiceContainer from './ServiceContainer';
import SimpleEventEmiter from './Tools/SimpleEventEmiter';
import ServiceNode from "./ServiceNode";
export default class ServiceManager extends SimpleEventEmiter {
    private readonly containerList;
    readonly serviceTable: Map<string, ServiceNode>;
    constructor(containerList: {
        containerName: string;
        containerClass: typeof ServiceContainer;
    }[]);
    /**
     * 创建一个新的服务节点
     *
     * @param {string} containerName 服务容器的类型名称
     * @param {*} containerConfig 服务容器配置
     * @param {string} serviceName 要创建的服务名称
     * @param {string} serviceCode 服务代码
     * @param {string[]} importServices 服务依赖的服务名称
     * @returns {ServiceNode}
     *
     * @memberof ServiceManager
     */
    create(containerName: string, containerConfig: any, serviceName: string, serviceCode: string, importServices: string[]): ServiceNode;
    /**
     * 启动服务
     *
     * @param {string} serviceName 要启动的服务名称
     *
     * @memberof ServiceManager
     */
    start(serviceName: string): void;
    /**
     * 关闭服务
     *
     * @param {string} serviceName 要关闭的服务名称
     *
     * @memberof ServiceManager
     */
    close(serviceName: string): void;
    /**
     * 销毁服务节点。
     * 注意如果该节点存在直接点，那子节点也会被销毁
     *
     * @param {string} serviceName 要销毁的服务名称
     *
     * @memberof ServiceManager
     */
    destroy(serviceName: string): void;
}
