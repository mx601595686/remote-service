import {ConnectionPort, MessageData} from '../../';

export class EmulatePort extends ConnectionPort {

    public isPrintMessage = false;

    constructor(public name: string, public port: EmulatePort) {
        super();
    }

    sendMessage(message: MessageData): void {
        if (this.isPrintMessage)
            console.log(this.name, message);
        this.port.onMessage(message);
    }
}

//模拟连接
export default class EmulateConnection {
    port1: EmulatePort;
    port2: EmulatePort;


    constructor() {
        this.port1 = new EmulatePort('port1', undefined);
        this.port2 = new EmulatePort('port2', this.port1);
        this.port1.port = this.port2;
    }

    printMessage(bool: boolean) {
        this.port1.isPrintMessage = bool;
        this.port2.isPrintMessage = bool;
    }
}