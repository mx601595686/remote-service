//服务容器

import ServiceController from './ServiceController';
import RunningState from './Tools/RunningState';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";
import SimpleEventEmiter from './Tools/SimpleEventEmiter';

/*
包含的事件
    //服务发生错误
    error: (err: Error) => void;
    //远端发来的标准输出
    stdout: (out: { type: number, timestamp: number, content: string }) => void;
    //远端服务运行状态发生改变
    runningStateChange: (state: RunningState) => void;
    //更新远端资源消耗情况
    updateResourceUsage: (usage: ResourceUsageInformation) => void;
*/

abstract class ServiceContainer extends SimpleEventEmiter {
    //服务控制器
    private controller: ServiceController;
    //关闭超时计时器
    private close_time_out: NodeJS.Timer;

    //服务运行状态
    runningState: RunningState = RunningState.closed;
    //服务运行错误
    errors: Error[] = [];
    //服务标准输出(type:1标准输出，type:2标准错误输出)
    stdout: { type: number, timestamp: number, content: string }[] = [];
    //最多保存多少条输出
    maxStdout = 10000;  //默认最多保存10000条
    //关闭服务超时
    closeTimeout = 1000 * 60;
    //资源消耗情况
    resourceUsage: ResourceUsageInformation;


    constructor(
        readonly serviceName: string,       //服务名称
        readonly serviceCode: string,       //服务代码
        readonly importServices: string[],  //服务依赖的其他服务
        config: any //配置服务容器的参数
    ) {
        super();
        if ('number' === typeof config.maxStdout)
            this.maxStdout = config.maxStdout;

        if ('number' === typeof config.closeTimeout)
            this.closeTimeout = config.closeTimeout;
    }

    /**
     * 创建服务的执行环境，记得把服务名称、服务依赖列表发过去
     * 
     * @abstract
     * @returns {ServiceController} 
     * 
     * @memberof ServiceContainer
     */
    protected abstract async onCreateEnvironment(): Promise<ServiceController>;

    /**
     * 销毁服务环境
     * 
     * @protected
     * @abstract
     * @returns {Promise<void>} 
     * 
     * @memberof ServiceContainer
     */
    protected abstract async onDestroyEnvironment(): Promise<void>;

    /**
     * 启动服务
     * 
     * @memberof ServiceContainer
     */
    async start() {
        if (this.runningState === RunningState.closed) {
            //标记为已启动
            this.runningState = RunningState.starting;
            this.emit('runningStateChange', RunningState.starting);

            //清理上次执行
            this.errors.length = 0;
            this.stdout.length = 0;
            this.resourceUsage = undefined;

            //创建远端环境
            this.controller = await this.onCreateEnvironment();

            //网络连接异常
            this.controller.onConnectionError = (err) => {
                this.errors.push(err);
                this.emit('error', err);
                this.forceClose();   //强制关闭
            };

            //远端服务发生错误
            this.controller.onRemoteServiceError = (err) => {
                this.errors.push(err);
                this.emit('error', err);
            };

            //远端标准错误输出
            this.controller.onRemoteStderr = (timestamp, content) => {
                const out = { type: 2, timestamp, content };
                this.stdout.push(out);
                if (this.stdout.length > this.maxStdout)
                    this.stdout.shift();
                this.emit('stdout', out);
            };

            //远端标准输出
            this.controller.onRemoteStdout = (timestamp, content) => {
                const out = { type: 1, timestamp, content };
                this.stdout.push(out);
                if (this.stdout.length > this.maxStdout)
                    this.stdout.shift();
                this.emit('stdout', out);
            };

            //远端运行状态发生改变
            this.controller.onRunningStateChange = (state) => {
                this.runningState = state;
                this.emit('runningStateChange', state);
                if (state === RunningState.closed) {
                    clearTimeout(this.close_time_out);
                    this.onDestroyEnvironment();
                }
            };

            //更新远端资源消耗
            this.controller.onUpdateResourceUsage = (usage) => {
                this.resourceUsage = usage;
                this.emit('updateResourceUsage', usage);
            };
        }
    }

    /**
     * 关闭服务
     * 
     * @memberof ServiceContainer
     */
    close() {
        if (this.runningState !== RunningState.closed) {
            this.controller.closeService();
            this.close_time_out = setTimeout(() => {
                this.forceClose();
            }, this.closeTimeout);
        }
    }

    /**
     * 强行关闭服务
     * 
     * @memberof ServiceContainer
     */
    async forceClose() {
        if (this.runningState !== RunningState.closed) {
            this.runningState = RunningState.closed;
            clearTimeout(this.close_time_out);
            await this.onDestroyEnvironment();
            this.emit('runningStateChange', RunningState.closed);
        }
    }
}

export default ServiceContainer;