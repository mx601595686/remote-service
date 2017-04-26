import BasicService from "./BasicService";
import ConnectionPort from "../tools/ConnectionPort";
import MessageData from "../tools/MessageData";
export declare abstract class RemoteService extends BasicService {
    onClose: () => boolean;
    onStop: () => boolean;
    onResume: () => boolean;
    onError: (err: Error) => boolean;
    protected exportPrivateServices: {
        close: any;
        stop: any;
        resume: any;
        execute: (jsCode: string) => Promise<void>;
    };
    protected importServicesCache: any;
    importServices: any;
    constructor(serviceName: string, port: ConnectionPort);
    close(): Promise<void>;
    stop(): Promise<void>;
    resume(): Promise<void>;
    protected abstract _execute(jsCode: string): Promise<void>;
    protected _updateProcessUsage(cpu: number, memory: number): void;
    protected _sendUncaughtError(err: Error): Promise<void>;
    protected _receiveEvent(message: MessageData): void;
}
