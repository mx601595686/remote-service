import ConnectionPort from '../tools/ConnectionPort';
import MessageData from "../tools/MessageData";
declare abstract class BasicService {
    protected readonly exportServices: any;
    protected readonly exportPrivateServices: any;
    protected readonly serviceName: string;
    private readonly port;
    private readonly callbackList;
    constructor(serviceName: string, port: ConnectionPort);
    protected sendInvoke(isPrivate: boolean, receiver: string, functionName: string, ...args: any[]): Promise<any>;
    private _responseInvoke(message);
    private _receiveInvoke(message);
    protected sendEvent(isPrivate: boolean, eventName: string, ...args: any[]): void;
    protected abstract _receiveEvent(message: MessageData): void;
}
export default BasicService;
