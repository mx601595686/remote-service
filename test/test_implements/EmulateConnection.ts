import { ConnectionPort, MessageData } from '../../';

export class EmulatePort extends ConnectionPort {

    constructor(public port: EmulatePort) {
        super();
    }

    sendMessage(message: MessageData): void {
        this.port.onMessage(message);
    }
}

//模拟连接
export default class EmulateConnection {
    port1: EmulatePort;
    port2: EmulatePort;

    constructor() {
        this.port1 = new EmulatePort(undefined);
        this.port2 = new EmulatePort(this.port1);
        this.port1.port = this.port2;
    }
}