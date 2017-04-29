/*
*   远端的服务初始化器
*/

import BasicService from "./BasicService";
import ConnectionPort from "../tools/ConnectionPort";
import { RunningState } from "./ServiceController";
import EventEmiter from "../tools/EventEmiter";
import MessageData from "../tools/MessageData";

export abstract class RemoteService extends BasicService {

    onClose = () => true;
    onStop = () => true;
    onResume = () => true;
    onError = (err: Error) => false;

    protected exportPrivateServices = {
        close: this.close.bind(this),
        stop: this.stop.bind(this),
        resume: this.resume.bind(this),
        execute: async (jsCode: string) => {
            await this._execute(jsCode);
            this.sendEvent(true, 'runningStateChange', RunningState.running);
        }
    };

    //远端服务缓存，可自定义一些方法对收到的结果做进一步处理
    protected importServicesCache: any = {/*services,event*/};

    //代理远端服务
    importServices: any = new Proxy<any>({}, {
        get: (target, remoteServiceName) => {
            if (!(remoteServiceName in this.importServicesCache)) {
                this.importServicesCache[remoteServiceName] = {
                    services: new Proxy(this.sendInvoke.bind(this, false, remoteServiceName), {
                        get(target, functionName) {
                            return target.bind(undefined, functionName);
                        }
                    }),
                    event: new EventEmiter()
                }
            }
            return this.importServicesCache[remoteServiceName];
        }
    });

    constructor(port: ConnectionPort) {
        super(port);
    }

    //关闭服务运行
    async close() {
        await this.onClose();
        this.sendEvent(true, 'runningStateChange', RunningState.closed);
    }

    //暂停服务运行
    async stop() {
        await this.onStop();
        this.sendEvent(true, 'runningStateChange', RunningState.stop);
    }

    //恢复服务运行
    async resume() {
        await this.onResume();
        this.sendEvent(true, 'runningStateChange', RunningState.running);
    }

    //执行代码，这个方法只能执行一次
    protected abstract _execute(jsCode: string): Promise<void>;

    //更新硬件资源使用状态
    protected _updateProcessUsage(cpu: number, memory: number) {
        this.sendEvent(true, 'processUsage', cpu, memory);
    }

    //发送未捕获异常
    protected async _sendUncaughtError(err: Error) {
        const send = await this.onError(err);
        if (!send)
            this.sendEvent(true, 'error', { message: err.message, stack: err.stack });
    }

    protected _receiveEvent(message: MessageData) {
        const service = this.importServicesCache[message.sender];
        if (service !== undefined) {
            service.event.emit(message.triggerName, ...message.args)
        }
    }
}
