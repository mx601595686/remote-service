import ConnectionPort from './ConnectionPort';
export default class RemoteServiceConnectionPort {
    readonly serviceName: string;
    readonly importServices: string[];
    private readonly port;
    private callbackList;
    invokeTimeout: number;
    onInternalMessage: (eventName: string | number, args: any[]) => void;
    onEventMessage: (sender: string, eventName: string | number, args: any[]) => void;
    onInvokeMessage: (functionName: string, args: any[]) => Promise<any>;
    onConnectionError: (err: Error) => void;
    constructor(serviceName: string, importServices: string[], port: ConnectionPort);
    /**
     * 发送一条内部事件给服务控制器
     *
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     *
     * @memberOf RemoteServiceConnectionPort
     */
    sendInternalMessage(eventName: string | number, ...args: any[]): void;
    /**
     * 发送事件消息给依赖了该服务的服务
     *
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     *
     * @memberOf RemoteServiceConnectionPort
     */
    sendEventMessage(eventName: string | number, ...args: any[]): void;
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
    sendInvoke(receiver: string, functionName: string, ...args: any[]): Promise<any>;
}
