import ConnectionPort from './ConnectionPort';
export default class ServiceControllerConnectionPort {
    readonly serviceName: string;
    private readonly port;
    constructor(serviceName: string, port: ConnectionPort);
}
