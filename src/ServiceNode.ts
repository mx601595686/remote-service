//对ServiceContainer的封装，简化启动关闭容器操作

import ServiceContainer from './ServiceContainer';
import ServiceManager from './ServiceManager';

export default class ServiceNode {

    readonly imports: ServiceNode[] = [];    //导入的服务
    readonly dependence: ServiceNode[] = []; //其他依赖该服务的服务

    constructor(
        readonly serviceContainer: ServiceContainer,
        manager: ServiceManager //服务管理器
    ) {
    }

    async forceCLose() {
        this.serviceContainer.
    }

    async close() {

    }

    async start() {

    }
}