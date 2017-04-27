import { ConnectionPort, MessageData } from '../../';

export class EmulatePort extends ConnectionPort {

    public isPrintMessage = false;
    public port: EmulatePort;

    onSendMessage(message: MessageData): void {
        if (this.isPrintMessage)
            console.log(this.serviceName, message);
        this.port.receiveMessage(message);
    }
}

//模拟连接
export default class EmulateConnection {
    port1: EmulatePort;
    port2: EmulatePort;


    constructor() {
        this.port1 = new EmulatePort('port1', []);
        this.port2 = new EmulatePort('port2', []);
        this.port1.port = this.port2;
    }

    printMessage(bool: boolean) {
        this.port1.isPrintMessage = bool;
        this.port2.isPrintMessage = bool;
    }
}