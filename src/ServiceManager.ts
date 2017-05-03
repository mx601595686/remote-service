//服务容器管理器

import ServiceContainer from './ServiceContainer';
import ServiceController from './ServiceController';
import RunningState from './Tools/RunningState';
import SimpleEventEmiter from './Tools/SimpleEventEmiter';
import ServiceNode from "./ServiceNode";

/*
事件名：
newNode,一个新的服务容器被创建
*/
export default class ServiceManager extends SimpleEventEmiter {

    readonly serviceTable = new Map<string, ServiceNode>();

    constructor(
        readonly containerList: any //容器列表，格式要求为 { containerName: string, containerClass: typeof ServiceContainer }
    ) {
        super();
        if ('object' === typeof containerList)
            throw new Error('containerList must be a object')
    }

    /**
     * 创建一个新的服务容器
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
    create(containerName: string, containerConfig: any, serviceName: string, serviceCode: string, importServices: string[]): ServiceNode {
        if (!(containerName in this.containerList)) {   //检查容器名称是否存在
            throw new Error(`do not has '${containerName}' container in container list`);
        } else if (this.serviceTable.has(serviceName)) {   //检查服务名是否存在
            throw new Error(`service '${serviceName}' already exists`);
        } else if (serviceName === ServiceController.controllerName) {  //检查服务名是否不等于ServiceController.controllerName
            throw new Error(`service name can not be '${ServiceController.controllerName}'`)
        } else {
            const container = new this.containerList[containerName](serviceName, serviceCode, importServices, containerConfig);
            const node = new ServiceNode(container, this);
            this.serviceTable.set(serviceName, node);
            this.emit('newNode', node);
            return node;
        }
    }

    /**
     * 启动服务
     * 
     * @param {string} serviceName 要启动的服务名称
     * 
     * @memberof ServiceManager
     */
    start(serviceName: string) {
        const node = this.serviceTable.get(serviceName);
        if (node !== undefined) {
            node.start();
            // throw new Error(`service '${serviceName}' dependent service '${notStartServiceName}' has not been started`);
        } else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }

    close(serviceName: string) {
        const service = this.serviceContainerCenter.get(serviceName);
        if (service !== undefined) {
            service.close();
        } else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }

    destroy(serviceName: string) {
        const service = this.serviceContainerCenter.get(serviceName);
        if (service !== undefined) {
            if (service.runningState === RunningState.closed) {
                this.serviceContainerCenter.delete(serviceName);
            } else {
                throw new Error(`service '${serviceName}' haven't been closed`);    //确保服务在销毁前被关闭了
            }
        }
    }
}
