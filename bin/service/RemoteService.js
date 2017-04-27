/*
*   远端的服务初始化器
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicService_1 = require("./BasicService");
const ServiceController_1 = require("./ServiceController");
const EventEmiter_1 = require("../tools/EventEmiter");
class RemoteService extends BasicService_1.default {
    constructor(port) {
        super(port);
        this.onClose = () => true;
        this.onStop = () => true;
        this.onResume = () => true;
        this.onError = (err) => false;
        this.exportPrivateServices = {
            close: this.close.bind(this),
            stop: this.stop.bind(this),
            resume: this.resume.bind(this),
            execute: async (jsCode) => {
                await this._execute(jsCode);
                this.sendEvent(true, 'runningStateChange', ServiceController_1.RunningState.running);
            }
        };
        //远端服务缓存，可自定义一些方法对收到的结果做进一步处理
        this.importServicesCache = {};
        //代理远端服务
        this.importServices = new Proxy({}, {
            get: (target, remoteServiceName) => {
                if (!(remoteServiceName in this.importServicesCache)) {
                    this.importServicesCache[remoteServiceName] = {
                        services: new Proxy(this.sendInvoke.bind(this, false, remoteServiceName), {
                            get(target, functionName) {
                                return target.bind(undefined, functionName);
                            }
                        }),
                        event: new EventEmiter_1.default()
                    };
                }
                return this.importServicesCache[remoteServiceName];
            }
        });
    }
    //关闭服务运行
    async close() {
        await this.onClose();
        this.sendEvent(true, 'runningStateChange', ServiceController_1.RunningState.closed);
    }
    //暂停服务运行
    async stop() {
        await this.onStop();
        this.sendEvent(true, 'runningStateChange', ServiceController_1.RunningState.stop);
    }
    //恢复服务运行
    async resume() {
        await this.onResume();
        this.sendEvent(true, 'runningStateChange', ServiceController_1.RunningState.running);
    }
    //更新硬件资源使用状态
    _updateProcessUsage(cpu, memory) {
        this.sendEvent(true, 'processUsage', cpu, memory);
    }
    //发送未捕获异常
    async _sendUncaughtError(err) {
        const send = await this.onError(err);
        if (!send)
            this.sendEvent(true, 'processUsage', { message: err.message, stack: err.stack });
    }
    _receiveEvent(message) {
        const service = this.importServicesCache[message.sender];
        if (service !== undefined) {
            service.event.emit(message.triggerName, ...message.args);
        }
    }
}
exports.RemoteService = RemoteService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UvUmVtb3RlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7RUFFRTs7O0FBRUYsaURBQTBDO0FBRTFDLDJEQUFtRDtBQUNuRCxzREFBK0M7QUFHL0MsbUJBQW9DLFNBQVEsc0JBQVk7SUFxQ3BELFlBQVksSUFBb0I7UUFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBcENoQixZQUFPLEdBQUcsTUFBTSxJQUFJLENBQUM7UUFDckIsV0FBTSxHQUFHLE1BQU0sSUFBSSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQztRQUN0QixZQUFPLEdBQUcsQ0FBQyxHQUFVLEtBQUssS0FBSyxDQUFDO1FBRXRCLDBCQUFxQixHQUFHO1lBQzlCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzlCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBYztnQkFDMUIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxnQ0FBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JFLENBQUM7U0FDSixDQUFDO1FBRUYsNkJBQTZCO1FBQ25CLHdCQUFtQixHQUFRLEVBQW9CLENBQUM7UUFFMUQsUUFBUTtRQUNSLG1CQUFjLEdBQVEsSUFBSSxLQUFLLENBQU0sRUFBRSxFQUFFO1lBQ3JDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO3dCQUMxQyxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxFQUFFOzRCQUN0RSxHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVk7Z0NBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQzs0QkFDaEQsQ0FBQzt5QkFDSixDQUFDO3dCQUNGLEtBQUssRUFBRSxJQUFJLHFCQUFXLEVBQUU7cUJBQzNCLENBQUE7Z0JBQ0wsQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdkQsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUlILENBQUM7SUFFRCxRQUFRO0lBQ1IsS0FBSyxDQUFDLEtBQUs7UUFDUCxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxnQ0FBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxRQUFRO0lBQ1IsS0FBSyxDQUFDLElBQUk7UUFDTixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxnQ0FBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxRQUFRO0lBQ1IsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxnQ0FBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFLRCxZQUFZO0lBQ0YsbUJBQW1CLENBQUMsR0FBVyxFQUFFLE1BQWM7UUFDckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsU0FBUztJQUNDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxHQUFVO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRVMsYUFBYSxDQUFDLE9BQW9CO1FBQ3hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM1RCxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBaEZELHNDQWdGQyIsImZpbGUiOiJzZXJ2aWNlL1JlbW90ZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qICAg6L+c56uv55qE5pyN5Yqh5Yid5aeL5YyW5ZmoXHJcbiovXHJcblxyXG5pbXBvcnQgQmFzaWNTZXJ2aWNlIGZyb20gXCIuL0Jhc2ljU2VydmljZVwiO1xyXG5pbXBvcnQgQ29ubmVjdGlvblBvcnQgZnJvbSBcIi4uL3Rvb2xzL0Nvbm5lY3Rpb25Qb3J0XCI7XHJcbmltcG9ydCB7IFJ1bm5pbmdTdGF0ZSB9IGZyb20gXCIuL1NlcnZpY2VDb250cm9sbGVyXCI7XHJcbmltcG9ydCBFdmVudEVtaXRlciBmcm9tIFwiLi4vdG9vbHMvRXZlbnRFbWl0ZXJcIjtcclxuaW1wb3J0IE1lc3NhZ2VEYXRhIGZyb20gXCIuLi90b29scy9NZXNzYWdlRGF0YVwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlbW90ZVNlcnZpY2UgZXh0ZW5kcyBCYXNpY1NlcnZpY2Uge1xyXG5cclxuICAgIG9uQ2xvc2UgPSAoKSA9PiB0cnVlO1xyXG4gICAgb25TdG9wID0gKCkgPT4gdHJ1ZTtcclxuICAgIG9uUmVzdW1lID0gKCkgPT4gdHJ1ZTtcclxuICAgIG9uRXJyb3IgPSAoZXJyOiBFcnJvcikgPT4gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIGV4cG9ydFByaXZhdGVTZXJ2aWNlcyA9IHtcclxuICAgICAgICBjbG9zZTogdGhpcy5jbG9zZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIHN0b3A6IHRoaXMuc3RvcC5iaW5kKHRoaXMpLFxyXG4gICAgICAgIHJlc3VtZTogdGhpcy5yZXN1bWUuYmluZCh0aGlzKSxcclxuICAgICAgICBleGVjdXRlOiBhc3luYyAoanNDb2RlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZXhlY3V0ZShqc0NvZGUpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRFdmVudCh0cnVlLCAncnVubmluZ1N0YXRlQ2hhbmdlJywgUnVubmluZ1N0YXRlLnJ1bm5pbmcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy/ov5znq6/mnI3liqHnvJPlrZjvvIzlj6/oh6rlrprkuYnkuIDkupvmlrnms5Xlr7nmlLbliLDnmoTnu5PmnpzlgZrov5vkuIDmraXlpITnkIZcclxuICAgIHByb3RlY3RlZCBpbXBvcnRTZXJ2aWNlc0NhY2hlOiBhbnkgPSB7LypzZXJ2aWNlcyxldmVudCovfTtcclxuXHJcbiAgICAvL+S7o+eQhui/nOerr+acjeWKoVxyXG4gICAgaW1wb3J0U2VydmljZXM6IGFueSA9IG5ldyBQcm94eTxhbnk+KHt9LCB7XHJcbiAgICAgICAgZ2V0OiAodGFyZ2V0LCByZW1vdGVTZXJ2aWNlTmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIShyZW1vdGVTZXJ2aWNlTmFtZSBpbiB0aGlzLmltcG9ydFNlcnZpY2VzQ2FjaGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltcG9ydFNlcnZpY2VzQ2FjaGVbcmVtb3RlU2VydmljZU5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VzOiBuZXcgUHJveHkodGhpcy5zZW5kSW52b2tlLmJpbmQodGhpcywgZmFsc2UsIHJlbW90ZVNlcnZpY2VOYW1lKSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQodGFyZ2V0LCBmdW5jdGlvbk5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYmluZCh1bmRlZmluZWQsIGZ1bmN0aW9uTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBldmVudDogbmV3IEV2ZW50RW1pdGVyKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbXBvcnRTZXJ2aWNlc0NhY2hlW3JlbW90ZVNlcnZpY2VOYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3J0OiBDb25uZWN0aW9uUG9ydCkge1xyXG4gICAgICAgIHN1cGVyKHBvcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5YWz6Zet5pyN5Yqh6L+Q6KGMXHJcbiAgICBhc3luYyBjbG9zZSgpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLm9uQ2xvc2UoKTtcclxuICAgICAgICB0aGlzLnNlbmRFdmVudCh0cnVlLCAncnVubmluZ1N0YXRlQ2hhbmdlJywgUnVubmluZ1N0YXRlLmNsb3NlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mmoLlgZzmnI3liqHov5DooYxcclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5vblN0b3AoKTtcclxuICAgICAgICB0aGlzLnNlbmRFdmVudCh0cnVlLCAncnVubmluZ1N0YXRlQ2hhbmdlJywgUnVubmluZ1N0YXRlLnN0b3ApO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5oGi5aSN5pyN5Yqh6L+Q6KGMXHJcbiAgICBhc3luYyByZXN1bWUoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5vblJlc3VtZSgpO1xyXG4gICAgICAgIHRoaXMuc2VuZEV2ZW50KHRydWUsICdydW5uaW5nU3RhdGVDaGFuZ2UnLCBSdW5uaW5nU3RhdGUucnVubmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/miafooYzku6PnoIHvvIzov5nkuKrmlrnms5Xlj6rog73miafooYzkuIDmrKFcclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBfZXhlY3V0ZShqc0NvZGU6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gICAgLy/mm7TmlrDnoazku7botYTmupDkvb/nlKjnirbmgIFcclxuICAgIHByb3RlY3RlZCBfdXBkYXRlUHJvY2Vzc1VzYWdlKGNwdTogbnVtYmVyLCBtZW1vcnk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2VuZEV2ZW50KHRydWUsICdwcm9jZXNzVXNhZ2UnLCBjcHUsIG1lbW9yeSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/lj5HpgIHmnKrmjZXojrflvILluLhcclxuICAgIHByb3RlY3RlZCBhc3luYyBfc2VuZFVuY2F1Z2h0RXJyb3IoZXJyOiBFcnJvcikge1xyXG4gICAgICAgIGNvbnN0IHNlbmQgPSBhd2FpdCB0aGlzLm9uRXJyb3IoZXJyKTtcclxuICAgICAgICBpZiAoIXNlbmQpXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEV2ZW50KHRydWUsICdwcm9jZXNzVXNhZ2UnLCB7IG1lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGFjazogZXJyLnN0YWNrIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVjZWl2ZUV2ZW50KG1lc3NhZ2U6IE1lc3NhZ2VEYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IHRoaXMuaW1wb3J0U2VydmljZXNDYWNoZVttZXNzYWdlLnNlbmRlcl07XHJcbiAgICAgICAgaWYgKHNlcnZpY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZXJ2aWNlLmV2ZW50LmVtaXQobWVzc2FnZS50cmlnZ2VyTmFtZSwgLi4ubWVzc2FnZS5hcmdzKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=
