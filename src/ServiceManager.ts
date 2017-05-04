//服务容器管理器

import ServiceContainer from './ServiceContainer';
import ServiceController from './ServiceController';
import RunningState from './Tools/RunningState';
import SimpleEventEmiter from './Tools/SimpleEventEmiter';
import ServiceNode from "./ServiceNode";

/*
事件名：
create:(node)=>{}  一个新的服务容器被创建
start:(node)=>{}  一个节点被启动了
close:(node)=>{}  一个节点被关闭了
destroy:(node)=>{} 一个节点被销毁了
*/
export default class ServiceManager extends SimpleEventEmiter {
    //容器列表
    private readonly containerList: any = {};

    //服务节点列表
    readonly serviceTable = new Map<string, ServiceNode>();

    constructor(
        containerList: { containerName: string, containerClass: typeof ServiceContainer }[] //容器列表
    ) {
        super();
        containerList.forEach(({ containerName, containerClass }) => {
            this.containerList[containerName] = containerClass;
        });
    }

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
    create(containerName: string, containerConfig: any, serviceName: string, serviceCode: string, importServices: string[]): ServiceNode {
        if (!(containerName in this.containerList)) {   //检查容器名称是否存在
            throw new Error(`do not has '${containerName}' container in container list`);
        } else if (this.serviceTable.has(serviceName)) {   //检查服务名是否存在
            throw new Error(`service '${serviceName}' already exists`);
        } else if (serviceName === ServiceController.controllerName) {  //检查服务名是否不等于ServiceController.controllerName
            throw new Error(`service name can not be '${ServiceController.controllerName}'`)
        } else if (!importServices.every(name => this.serviceTable.has(name))) { //确保依赖的服务都已经被创建了
            const notCreated = importServices.find((name => !this.serviceTable.has(name)));
            throw new Error(`importing service '${notCreated}' has not been created`);
        } else {
            const container = new this.containerList[containerName](serviceName, serviceCode, importServices, containerConfig);
            const node = new ServiceNode(container);
            this.serviceTable.set(serviceName, node);

            //设置依赖的服务节点
            importServices.forEach(name => {
                const service = this.serviceTable.get(name);
                service.dependence.push(node);
                node.imports.push(service);
            });

            //监控容器状态变化
            node.serviceContainer.on('runningStateChange', (state: RunningState) => {
                switch (state) {
                    case RunningState.running: {
                        this.emit('start', this);
                        break;
                    }
                    case RunningState.closed: {
                        this.emit('close', this);
                        break;
                    }
                }
            });

            this.emit('create', node);
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
        } else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }

    /**
     * 关闭服务
     * 
     * @param {string} serviceName 要关闭的服务名称
     * 
     * @memberof ServiceManager
     */
    close(serviceName: string) {
        const service = this.serviceTable.get(serviceName);
        if (service !== undefined) {
            service.close();
        } else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }

    /**
     * 销毁服务节点。
     * 注意如果该节点存在直接点，那子节点也会被销毁
     * 
     * @param {string} serviceName 要销毁的服务名称
     * 
     * @memberof ServiceManager
     */
    destroy(serviceName: string) {
        const service = this.serviceTable.get(serviceName);
        if (service !== undefined) {
            if (service.serviceContainer.runningState === RunningState.closed) {

                //销毁依赖该服务的服务
                service.dependence.forEach(node => this.destroy(node.serviceContainer.serviceName));

                //移除该节点在其他服务中的依赖
                service.imports.forEach(node => {
                    const index = node.dependence.indexOf(service);
                    if (index !== -1)
                        node.dependence.splice(index, 1);
                });

                this.emit('destroy', service);
                this.serviceTable.delete(serviceName);
            } else {
                throw new Error(`service '${serviceName}' haven't been closed`);    //确保服务在销毁前被关闭了
            }
        } else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }
}
