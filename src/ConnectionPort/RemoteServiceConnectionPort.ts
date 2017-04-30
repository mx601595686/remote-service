//远程服务使用的连接端口。提供了对ConnectionPort的封装，方便使用

import ConnectionPort from './ConnectionPort';
import Message from "../Message/Message";
import InternalMessage from "../Message/InternalMessage";
import ResponseMessage from "../Message/ResponseMessage";
import InvokeMessage from "../Message/InvokeMessage";
import EventMessage from "../Message/EventMessage";
import MessageType from "../Message/MessageType";
import ServiceController from './../ServiceController';
import RemoteInvokeError from "../Tools/RemoteInvokeError";


export default class RemoteServiceConnectionPort {

    //回调列表
    private callbackList = new Map<string, (error: Error, returnData?: any) => void>();

    invokeTimeout = 1000 * 60;  //调用远程方法超时，默认一分钟

    //内部接收控制器发来的事件消息的回调函数。
    onInternalMessage: (eventName: string | number, args: any[]) => void;

    //内部接收事件消息的回调函数。
    onEventMessage: (eventName: string | number, args: any[]) => void;

    //内部接收调用请求的回调函数。
    onInvokeMessage: (functionName: string, args: any[]) => Promise<any>;

    //内部注册的网络异常回调函数。
    onError: (err: Error) => void;

    constructor(
        readonly serviceName: string,   //服务名称
        readonly importServices: string[],  //依赖的服务名称列表
        private readonly port: ConnectionPort   //连接端口
    ) {
        port.onError = (err: Error) => this.onError && this.onError(err);
        port.onMessage = (message: Message) => {
            //验证消息

            badMessage: if (message.receiver === this.serviceName) {
                switch (message.type) {
                    case MessageType.internal: {    //如果是内部事件消息
                        if (message.sender === ServiceController.controllerName) {
                            if (this.onInternalMessage !== undefined)
                                this.onInternalMessage(
                                    (<InternalMessage>message).data.eventName,
                                    (<InternalMessage>message).data.args);
                            return;
                        }
                        break badMessage;
                    }
                    case MessageType.event: {
                        if (this.importServices.includes(message.sender)) { //确保只收到该服务依赖的服务发来的事件
                            if (this.onEventMessage !== undefined)
                                this.onEventMessage(
                                    (<EventMessage>message).data.eventName,
                                    (<EventMessage>message).data.args);
                            return;
                        }
                        break badMessage;
                    }
                    case MessageType.invoke: {
                        //调用不用验证发送者
                        if (this.onInvokeMessage !== undefined)
                            this.onInvokeMessage(
                                (<InvokeMessage>message).data.functionName,
                                (<InvokeMessage>message).data.args)

                                //回复调用请求
                                .then((returnValue: any) => {
                                    this.port.sendMessage(new ResponseMessage(message, this.serviceName, undefined, returnValue));
                                })
                                .catch((err: Error) => {
                                    this.port.sendMessage(new ResponseMessage(message, this.serviceName, err));
                                });
                        return;
                    }
                    case MessageType.response: {
                        if (this.importServices.includes(message.sender)) { //确保只收到该服务依赖的服务发来的回复
                            const callback = this.callbackList.get((<ResponseMessage>message).data.callback);
                            this.callbackList.delete((<ResponseMessage>message).data.callback);
                            if (callback !== undefined) {
                                const { error, returnData } = (<ResponseMessage>message).data;
                                error ? callback(new RemoteInvokeError(error)) : callback(undefined, returnData);
                            }
                            return;
                        }
                        break badMessage;
                    }
                }
            }

            console.error('Remote service has received a bad message: ', message);
        };
    }

    /**
     * 发送一条内部事件给服务控制器
     * 
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     * 
     * @memberOf RemoteServiceConnectionPort
     */
    sendInternalMessage(eventName: string | number, ...args: any[]) {
        this.port.sendMessage(new InternalMessage(false, this.serviceName, eventName, args));
    }

    /**
     * 发送事件消息给依赖了该服务的服务
     * 
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     * 
     * @memberOf RemoteServiceConnectionPort
     */
    sendEventMessage(eventName: string | number, ...args: any[]) {
        this.port.sendMessage(new EventMessage(this.serviceName, eventName, args));
    }

    /**
     * 向依赖的服务发送方法调用请求
     * 
     * @param {string} receiver 依赖的服务名称
     * @param {string} functionName 要调用的方法名
     * @param {...any[]} args 参数
     * @returns {Promise<any>} 
     * 
     * @memberOf RemoteServiceConnectionPort
     */
    sendInvokeMessage(receiver: string, functionName: string, ...args: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.importServices.includes(receiver)) {   //判断调用的服务在不在依赖服务列表中
                //创建消息
                const message = new InvokeMessage(this.serviceName, receiver, functionName, args);

                //创建回调
                this.callbackList.set(message.data.callback, function (error: Error, returnData?: any) {
                    error ? reject(error) : resolve(returnData);
                });

                //发送消息
                this.port.sendMessage(message);

                //超时处理
                setTimeout(() => {
                    const callback = this.callbackList.get(message.data.callback);
                    this.callbackList.delete(message.data.callback);
                    if (callback !== undefined) {
                        callback(new Error(`invoke '${message.receiver[0]}.${message.data.functionName}' timeout`));
                    }
                }, this.invokeTimeout);
            } else {
                reject(new Error(`invoking service '${receiver}' is not in importing services list`));
            }
        });
    }
}