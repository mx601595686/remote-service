//对ServiceContainer的封装，简化启动关闭容器操作

import ServiceContainer from './ServiceContainer';
import ServiceManager from './ServiceManager';
import RunningState from './Tools/RunningState';

export default class ServiceNode {
    //服务完全关闭回调列表
    private readonly onClosedCallbackList: Function[] = [];
    //服务完全启动回调列表
    private readonly onRunningCallbackList: Function[] = [];

    //导入的服务,由ServiceManager来设置
    readonly imports: ServiceNode[] = [];
    //其他依赖该服务的服务,由ServiceManager来设置
    readonly dependence: ServiceNode[] = [];

    constructor(
        readonly serviceContainer: ServiceContainer
    ) {
        //调用回调列表
        serviceContainer.on('runningStateChange', (state: RunningState) => {
            switch (state) {
                case RunningState.running: {
                    this.onRunningCallbackList.forEach(item => item());
                    this.onRunningCallbackList.length = 0;
                    break;
                }
                case RunningState.closed: {
                    this.onClosedCallbackList.forEach(item => item());
                    this.onClosedCallbackList.length = 0;

                    //关闭后还要再检查一下所有依赖了该服务的服务是否关闭了（这样做是为了针对服务崩溃的情况）
                    this.dependence.forEach(node => node.close());
                    break;
                }
            }
        });
    }

    /**
     * 关闭服务容器
     * 
     * @returns {Promise<void>} 
     * 
     * @memberof ServiceNode
     */
    async close(): Promise<void> {
        //在关闭之前检查是否所有的子服务都已经被关闭了
        for (let node of this.dependence) {
            await node.close();
        }

        return new Promise<void>((resolve) => {
            if (this.serviceContainer.runningState !== RunningState.closed) {
                this.onClosedCallbackList.push(resolve);
                this.serviceContainer.close();
            } else {
                resolve();
            }
        });
    }

    /**
     * 启动服务容器
     * 
     * @returns {Promise<void>} 
     * 
     * @memberof ServiceNode
     */
    start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            //检查是否所有依赖服务都已经启动了
            const isStart = this.imports.some(node => {
                const notRunning = node.serviceContainer.runningState !== RunningState.running;
                if (notRunning)
                    reject(new Error(`Service '$ {this.serviceContainer.serviceName}' depended on service '$ {node.serviceContainer.serviceName}' has not been started`));
                return notRunning;
            });

            if (isStart) {
                if (this.serviceContainer.runningState === RunningState.closed) {
                    this.onRunningCallbackList.push(resolve);
                    this.serviceContainer.start();
                } else {
                    resolve();
                }
            }
        });
    }
}