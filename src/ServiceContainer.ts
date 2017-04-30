import ServiceController from './ServiceController';
import RunningState from './Tools/RunningState';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";

//服务容器

abstract class ServiceContainer {
    //服务控制器
    private controller: ServiceController;

    //服务运行状态
    runningState: RunningState = RunningState.closed;
    //服务运行错误
    errors: Error[] = [];
    //服务标准输出(type:1标准输出，type:2标准错误输出)
    stdout: { type: number, timestamp: number, content: string }[] = [];
    //最多保存多少条输出
    maxStdout = 10000;  //默认最多保存10000条
    //资源消耗情况
    resourceUsage: ResourceUsageInformation;

    //服务发生错误
    onError: (err: Error) => void;
    //远端发来的标准输出
    onStdout: (out: { type: number, timestamp: number, content: string }) => void;
    //远端服务运行状态发生改变
    onRunningStateChange: (state: RunningState) => void;
    //更新远端资源消耗情况
    onUpdateResourceUsage: (usage: ResourceUsageInformation) => void;


    constructor(
        readonly serviceName: string,       //服务名称
        readonly serviceCode: string,       //服务代码
        readonly importServices: string[],  //服务依赖的其他服务
    ) { }

    /**
     * 创建服务的执行环境，记得把服务名称、服务依赖列表发过去
     * 
     * @abstract
     * @returns {ServiceController} 
     * 
     * @memberof ServiceContainer
     */
    protected abstract async onCreateEnvironment(): Promise<ServiceController>;

    async start() {
        if (this.runningState === RunningState.closed) {
            //标记为已启动
            this.runningState = RunningState.starting;
            this.onRunningStateChange && this.onRunningStateChange(RunningState.starting);

            //清理上次执行
            this.errors.length = 0;
            this.stdout.length = 0;
            this.resourceUsage = undefined;

            //创建远端环境
            this.controller = await this.onCreateEnvironment();

            //网络连接异常
            this.controller.onConnectionError = (err) => {
                this.errors.push(err);
                this.onError && this.onError(err);
                this.close();   //通知关闭
            };

            //服务执行错误
            this.controller.onRemoteServiceError = (err) => {
                this.errors.push(err);
                this.onError && this.onError(err);
            };

            //远端标准错误输出
            this.controller.onRemoteStderr = (timestamp, content) => {
                const out = { type: 2, timestamp, content };
                this.stdout.push(out);
                if (this.stdout.length > this.maxStdout)
                    this.stdout.shift();
                this.onStdout && this.onStdout(out);
            };
            
            //远端标准输出
            this.controller.onRemoteStdout = (timestamp, content) => {
                const out = { type: 1, timestamp, content };
                this.stdout.push(out);
                if (this.stdout.length > this.maxStdout)
                    this.stdout.shift();
                this.onStdout && this.onStdout(out);
            };

            //远端运行状态发生改变
            this.controller.onRunningStateChange = (state) => {
                this.runningState = state;
                this.onRunningStateChange && this.onRunningStateChange(state);
            };

            //更新远端资源消耗
            this.controller.onUpdateResourceUsage = (usage) => {
                this.resourceUsage = usage;
                this.onUpdateResourceUsage && this.onUpdateResourceUsage(usage);
            };
        }
    }

    close() {
        if (this.runningState !== RunningState.closed) {
            this.controller.closeService();
        }
    }
}

export default ServiceContainer;