/*
 *   远端服务控制器
 *   控制器也是一个服务，只不过这个服务只能向它所对应的远端提供服务，同时也只能调用它所对应的远端提供的服务
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
    services: any;                  //代理远端的公开服务
    privateServices: any;           //代理远端私有服务
    event: EventEmiter;             //远端发过来的事件
    cpuUsage: Number;               //cpu累计消耗（什么单位）
    memoryUsage: Number;            //内存消耗（byte）
    errors: Array<Error>;           //远端发生的未捕获错误
    runningState: RunningState;     //现在的运行状态
    startTime: Date;                //远端服务启动事件
}

export class ServiceController extends BasicService {

    static controllerName = '__Controller__';   //控制器的名称

    protected exportPrivateServices = {
        close: () => {
            this.close();
        },
        stop: () => {
            this.stop();
        }
    };

    readonly remoteServiceName: string;
    readonly remote: Remote;

    constructor(port: ConnectionPort) {
        super(port);
        
        this.remoteServiceName = port.serviceName;
        port.serviceName = ServiceController.controllerName;
        port.importServices.length = 0;

        //代理远端
        this.remote = {
            services: new Proxy<any>(this.sendInvoke.bind(this, false, this.remoteServiceName), {
                get(target, functionName) {
                    return target.bind(undefined, functionName);
                }
            }),
            privateServices: new Proxy<any>(this.sendInvoke.bind(this, true, this.remoteServiceName), {
                get(target, functionName) {
                    return target.bind(undefined, functionName);
                }
            }),
            event: new EventEmiter(),
            cpuUsage: undefined,
            memoryUsage: undefined,
            errors: [],
            runningState: RunningState.initialized,
            startTime: undefined
        };

        //更新硬件资源使用状态
        this.remote.event.on('processUsage', (cpu: number, memory: number) => {
            this.remote.cpuUsage = cpu;
            this.remote.memoryUsage = memory;
        });

        //运行状态发生改变
        this.remote.event.on('runningStateChange', (state: RunningState) => {
            this.remote.runningState = state;
        });

        //远端运行时出现未捕获的异常
        this.remote.event.on('error', (err: any) => {
            this.remote.errors.push(new RemoteError(err));
        });
    }

    //在远端执行代码，这个方法只能执行一次
    async execute(jsCode: string) {
        if (this.remote.runningState === RunningState.initialized) {
            await this.remote.privateServices.execute(jsCode);
            this.remote.startTime = new Date();
        } else {
            throw new Error('code has been executed');
        }
    }

    //关闭远端运行
    async close() {
        await this.remote.privateServices.close();
    }

    async stop() {
        await this.remote.privateServices.stop();
    }

    async resume() {
        await this.remote.privateServices.resume();
    }

    protected _receiveEvent(message: MessageData) {
        this.remote.event.emit(message.triggerName, ...message.args);
    }
}