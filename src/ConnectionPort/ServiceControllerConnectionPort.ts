//服务控制器使用的连接端口。提供了对ConnectionPort的封装，方便使用
import ConnectionPort from './ConnectionPort';
import InternalMessage from "../Message/InternalMessage";
import MessageType from "../Message/MessageType";
import ServiceController from './../ServiceController';

export default class ServiceControllerConnectionPort {

    //内部注册的消息接收回调函数。
    onMessage: (eventName: string | number, args: any[]) => void;

    //内部注册的网络异常回调函数。
    onError: (err: Error) => void;

    constructor(
        readonly serviceName: string,   //服务名称
        private readonly port: ConnectionPort   //连接端口
    ) {
        port.onError = (err: Error) => this.onError && this.onError(err);
        port.onMessage = (message: InternalMessage) => {
            //验证消息
            if (message.type === MessageType.internal)
                if (message.sender === this.serviceName)
                    if (message.receiver[0] === ServiceController.controllerName) {
                        if (this.onMessage !== undefined)
                            this.onMessage(message.data.eventName, message.data.args);
                        return;
                    }

            console.error('Service controller has received a bad message: ', message);
        };
    }

    /**
     * 向远端服务发送事件消息
     * 
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     * 
     * @memberOf ServiceControllerConnectionPort
     */
    sendMessage(eventName: string | number, ...args: any[]): void {
        this.port.sendMessage(new InternalMessage(true, this.serviceName, eventName, args));
    }
}