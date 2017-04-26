/*
*   远端服务控制器
*/

import BasicService from "./BasicService";
import EventEmiter from "../tools/EventEmiter";
import MessageData from "../tools/MessageData";
import ConnectionPort from "../tools/ConnectionPort";
import RemoteError from "../tools/RemoteError";

export enum RunningState {
    initialized,    //远端环境已经初始化好，等待运行代码
    running,        //正在运行代码
    stop,           //暂停代码执行
    closed          //终止远端代码执行并销毁环境
}

export interface Remote {
    privateServices: any;           //代理远端私有服务
    event: EventEmiter;             //远端发过来的事件
    cpuUsage: Number;               //cpu累计消耗（什么单位）
    memoryUsage: Number;            //内存消耗（byte）
    errors: Array<Error>;           //远端发生的未捕获错误
    runningState: RunningState;     //现在的运行状态
    startTime: Date;                //远端服务启动事件
}

class ServiceController extends BasicService {

    private readonly jsCode: string;

    exportPrivateServices = {
        close: () => {
            this.close();
        },
        stop: () => {
            this.stop();
        }
    };

    remote: Remote = {
        privateServices: new Proxy<any>(this.sendInvoke.bind(this, true, '__Controller__'), {
            get(target, functionName) {
                return target.bind(undefined, functionName);
            }
        }),
        event: new EventEmiter(),
        cpuUsage: undefined,
        memoryUsage: undefined,
        errors: [],
        runningState: RunningState.initialized,
        startTime: new Date()
    };

    constructor(serviceName: string, jsCode: string, port: ConnectionPort) {
        super(serviceName, port);
        this.jsCode = jsCode;

        this.remote.event.on('processUsage', (cpu: number, memory: number) => {
            this.remote.cpuUsage = cpu;
            this.remote.memoryUsage = memory;
        });

        this.remote.event.on('runningStateChange', (state: RunningState) => {
            this.remote.runningState = state;
        });

        this.remote.event.on('error', (err: any) => {
            this.remote.errors.push(new RemoteError(err));
        });
    }

    async start() {
        if (this.remote.runningState === RunningState.initialized) {
            await this.remote.privateServices.start(this.jsCode);
        }
    }

    async close() {
        await this.remote.privateServices.close();
    }

    async stop() {
        await this.remote.privateServices.stop();
    }

    async resume() {
        await this.remote.privateServices.resume();
    }

    protected _receiveEvent(message: MessageData): any {
        const event = super._receiveEvent(message);
        this.remote.event.emit(event.event, event.data);
    }
}

export default ServiceController;