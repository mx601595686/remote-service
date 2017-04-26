import BasicService from "./BasicService";
import EventEmiter from "../tools/EventEmiter";
import MessageData from "../tools/MessageData";
import ConnectionPort from "../tools/ConnectionPort";
export declare enum RunningState {
    initialized = 0,
    running = 1,
    stop = 2,
    closed = 3,
}
export interface Remote {
    services: any;
    privateServices: any;
    event: EventEmiter;
    cpuUsage: Number;
    memoryUsage: Number;
    errors: Array<Error>;
    runningState: RunningState;
    startTime: Date;
}
export declare class ServiceController extends BasicService {
    readonly jsCode: string;
    protected exportPrivateServices: {
        close: () => void;
        stop: () => void;
    };
    readonly remote: Remote;
    constructor(jsCode: string, port: ConnectionPort);
    execute(): Promise<void>;
    close(): Promise<void>;
    stop(): Promise<void>;
    resume(): Promise<void>;
    protected _receiveEvent(message: MessageData): void;
}
