import ConnectionPort from './ConnectionPort';
export default class ServiceControllerConnectionPort {
    readonly serviceName: string;
    private readonly port;
    onInternalMessage: (eventName: string | number, args: any[]) => void;
    onConnectionError: (err: Error) => void;
    constructor(serviceName: string, port: ConnectionPort);
    /**
     * 向远端服务发送内部事件消息
     *
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     *
     * @memberOf ServiceControllerConnectionPort
     */
    sendInternalMessage(eventName: string | number, ...args: any[]): void;
}
