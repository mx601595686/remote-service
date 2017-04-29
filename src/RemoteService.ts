//用于处理对应控制器或其他远程服务发送过来的请求和事件。

import ConnectionPort from './ConnectionPort/ConnectionPort';
import RemoteServiceConnectionPort from './ConnectionPort/RemoteServiceConnectionPort';
import RunningState from './Tools/RunningState';
import ResourceUsageInformation from "./Tools/ResourceUsageInformation";
import InternalEventName from "./Tools/InternalEventName";

abstract class RemoteService {

    private readonly port: RemoteServiceConnectionPort;

    constructor(
        readonly serviceName: string,
        importServices: string[],
        port: ConnectionPort
    ) {
        this.port = new RemoteServiceConnectionPort(serviceName, importServices, port);
        this.port.onError = () => this.onClose();
    }

    abstract onClose(): Promise<void>;
    abstract onExecuteCode(serviceCode: string): Promise<void>;
}

export default RemoteService;