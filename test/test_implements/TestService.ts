import {RemoteService, ConnectionPort} from '../../';
import * as vm from 'vm';
import * as EventEmiter from 'events';

export default class TestService extends RemoteService {

    stdout = new EventEmiter();
    stderr = new EventEmiter();

    private interval: any[] = [];

    constructor(serviceName: string, port: ConnectionPort) {
        super(serviceName, port);

        this.interval.push(setInterval(() => {
            let cpu = process.cpuUsage();
            this._updateProcessUsage(
                cpu.system + cpu.user,
                process.memoryUsage().heapTotal
            )
        }, 500));

        this._sendUncaughtError = this._sendUncaughtError.bind(this);
        process.on('uncaughtException', this._sendUncaughtError);
        process.on('unhandledRejection', this._sendUncaughtError);
    }

    protected async _execute(jsCode: string): Promise<void> {

        const this_ = this;
        const context = {
            console: {
                out: (...args: any[]) => {
                    this.stdout.emit('data', args);
                },
                error: (...args: any[]) => {
                    this.stderr.emit('data', args);
                }
            },
            setTimeout,
            setInterval,
            rs: {
                get onError() {
                    return this_.onError;
                },
                set onError(value) {
                    this_.onError = value;
                },
                get onClose() {
                    return this_.onClose;
                },
                set onClose(value) {
                    this_.onClose = value;
                },
                get onResume() {
                    return this_.onResume;
                },
                set onResume(value) {
                    this_.onResume = value;
                },
                get onStop() {
                    return this_.onStop;
                },
                set onStop(value) {
                    this_.onStop = value;
                },
                imports: this.importServices,
                exports: this.exportServices,
                close: this.close.bind(this),
                stop: this.stop.bind(this),
                resume: this.resume.bind(this),
                emit: this.sendEvent.bind(this, false)
            }
        };

        vm.runInNewContext(jsCode, context, {
            filename: "test.js"
        })
    }

    //清楚所有操作
    destroy() {
        this.interval.forEach(item => clearInterval(item));
        process.removeListener('uncaughtException', this._sendUncaughtError);
        process.removeListener('unhandledRejection', this._sendUncaughtError);
    }
}