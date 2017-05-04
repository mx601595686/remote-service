"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceControllerConnectionPort_1 = require("./ConnectionPort/ServiceControllerConnectionPort");
const RemoteError_1 = require("./Tools/RemoteError");
class ServiceController {
    constructor(serviceName, serviceCode, port) {
        this.serviceName = serviceName;
        this.port = new ServiceControllerConnectionPort_1.default(serviceName, port);
        //网络连接出现异常
        this.port.onConnectionError = (err) => this.onConnectionError && this.onConnectionError(err);
        //接受远端发来的消息
        this.port.onInternalMessage = (eventName, args) => {
            switch (eventName) {
                case 0 /* remoteReady */: {
                    this.port.sendInternalMessage(1 /* executeServiceCode */, serviceCode);
                    break;
                }
                case 4 /* remoteServiceError */: {
                    this.onRemoteServiceError &&
                        this.onRemoteServiceError(new RemoteError_1.default(args[0]));
                    break;
                }
                case 6 /* remoteStderr */: {
                    this.onRemoteStderr && this.onRemoteStderr(args[0], args[1]);
                    break;
                }
                case 5 /* remoteStdout */: {
                    this.onRemoteStdout && this.onRemoteStdout(args[0], args[1]);
                    break;
                }
                case 3 /* runningStateChange */: {
                    this.onRunningStateChange && this.onRunningStateChange(args[0]);
                    break;
                }
                case 7 /* updateResourceUsage */: {
                    this.onUpdateResourceUsage && this.onUpdateResourceUsage(args[0]);
                    break;
                }
                default: {
                    this.onMessage && this.onMessage(eventName.toString(), args);
                    break;
                }
            }
        };
    }
    /**
     * 向远端发送事件
     *
     * @protected
     * @param {string} eventName 事件名
     * @param {...any[]} args 参数
     *
     * @memberOf ServiceController
     */
    sendMessage(eventName, ...args) {
        //不允许发送数字类型的事件名是为了避免与内部事件名相冲突
        this.port.sendInternalMessage(eventName, args);
    }
    /**
     * 通知关闭远程服务
     * @memberOf ServiceController
     */
    closeService() {
        this.port.sendInternalMessage(2 /* close */);
    }
}
ServiceController.controllerName = '__controller__'; //控制器的默认名称
exports.default = ServiceController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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aWNlQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8v5pyN5Yqh5o6n5Yi25ZmoXHJcbmltcG9ydCBDb25uZWN0aW9uUG9ydCBmcm9tICcuL0Nvbm5lY3Rpb25Qb3J0L0Nvbm5lY3Rpb25Qb3J0JztcclxuaW1wb3J0IFNlcnZpY2VDb250cm9sbGVyQ29ubmVjdGlvblBvcnQgZnJvbSAnLi9Db25uZWN0aW9uUG9ydC9TZXJ2aWNlQ29udHJvbGxlckNvbm5lY3Rpb25Qb3J0JztcclxuaW1wb3J0IFJ1bm5pbmdTdGF0ZSBmcm9tICcuL1Rvb2xzL1J1bm5pbmdTdGF0ZSc7XHJcbmltcG9ydCBSZXNvdXJjZVVzYWdlSW5mb3JtYXRpb24gZnJvbSBcIi4vVG9vbHMvUmVzb3VyY2VVc2FnZUluZm9ybWF0aW9uXCI7XHJcbmltcG9ydCBJbnRlcm5hbEV2ZW50TmFtZSBmcm9tIFwiLi9Ub29scy9JbnRlcm5hbEV2ZW50TmFtZVwiO1xyXG5pbXBvcnQgUmVtb3RlRXJyb3IgZnJvbSBcIi4vVG9vbHMvUmVtb3RlRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIHtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb250cm9sbGVyTmFtZSA9ICdfX2NvbnRyb2xsZXJfXyc7ICAgICAvL+aOp+WItuWZqOeahOm7mOiupOWQjeensFxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcG9ydDogU2VydmljZUNvbnRyb2xsZXJDb25uZWN0aW9uUG9ydDtcclxuXHJcbiAgICAvL+W9k+S4jui/nOerr+acjeWKoei/nuaOpeWHuueOsOW8guW4uFxyXG4gICAgb25Db25uZWN0aW9uRXJyb3I6IChlcnI6IEVycm9yKSA9PiB2b2lkO1xyXG4gICAgLy/ov5znq6/mnI3liqHov5DooYznirbmgIHlj5HnlJ/mlLnlj5hcclxuICAgIG9uUnVubmluZ1N0YXRlQ2hhbmdlOiAoc3RhdGU6IFJ1bm5pbmdTdGF0ZSkgPT4gdm9pZDtcclxuICAgIC8v5b2T6L+c56uv5pyN5Yqh5Y+R55Sf5byC5bi4XHJcbiAgICBvblJlbW90ZVNlcnZpY2VFcnJvcjogKGVycjogRXJyb3IpID0+IHZvaWQ7XHJcbiAgICAvL+i/nOerr+acjeWKoeeahOagh+WHhui+k+WHulxyXG4gICAgb25SZW1vdGVTdGRvdXQ6ICh0aW1lc3RhbXA6IG51bWJlciwgb3V0OiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgICAvL+i/nOerr+acjeWKoeeahOagh+WHhumUmeivr+i+k+WHulxyXG4gICAgb25SZW1vdGVTdGRlcnI6ICh0aW1lc3RhbXA6IG51bWJlciwgb3V0OiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgICAvL+abtOaWsOi/nOerr+i1hOa6kOa2iOiAl+aDheWGtVxyXG4gICAgb25VcGRhdGVSZXNvdXJjZVVzYWdlOiAodXNhZ2U6IFJlc291cmNlVXNhZ2VJbmZvcm1hdGlvbikgPT4gdm9pZDtcclxuXHJcbiAgICAvL+i/nOerr+WPkeadpeeahOWFtuS7luS6i+S7tlxyXG4gICAgcHJvdGVjdGVkIG9uTWVzc2FnZTogKGV2ZW50TmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHNlcnZpY2VDb2RlOiBzdHJpbmcsXHJcbiAgICAgICAgcG9ydDogQ29ubmVjdGlvblBvcnRcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucG9ydCA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlckNvbm5lY3Rpb25Qb3J0KHNlcnZpY2VOYW1lLCBwb3J0KTtcclxuXHJcbiAgICAgICAgLy/nvZHnu5zov57mjqXlh7rnjrDlvILluLhcclxuICAgICAgICB0aGlzLnBvcnQub25Db25uZWN0aW9uRXJyb3IgPSAoZXJyKSA9PiB0aGlzLm9uQ29ubmVjdGlvbkVycm9yICYmIHRoaXMub25Db25uZWN0aW9uRXJyb3IoZXJyKTtcclxuICAgICAgICAvL+aOpeWPl+i/nOerr+WPkeadpeeahOa2iOaBr1xyXG4gICAgICAgIHRoaXMucG9ydC5vbkludGVybmFsTWVzc2FnZSA9IChldmVudE5hbWUsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgSW50ZXJuYWxFdmVudE5hbWUucmVtb3RlUmVhZHk6IHsgICAvL+W9k+i/nOerr+WHhuWkh+WlveS6huWwseWPkemAgeimgeaJp+ihjOeahOacjeWKoeS7o+eggVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9ydC5zZW5kSW50ZXJuYWxNZXNzYWdlKEludGVybmFsRXZlbnROYW1lLmV4ZWN1dGVTZXJ2aWNlQ29kZSwgc2VydmljZUNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBJbnRlcm5hbEV2ZW50TmFtZS5yZW1vdGVTZXJ2aWNlRXJyb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3RlU2VydmljZUVycm9yICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25SZW1vdGVTZXJ2aWNlRXJyb3IobmV3IFJlbW90ZUVycm9yKGFyZ3NbMF0pKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBJbnRlcm5hbEV2ZW50TmFtZS5yZW1vdGVTdGRlcnI6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3RlU3RkZXJyICYmIHRoaXMub25SZW1vdGVTdGRlcnIoYXJnc1swXSwgYXJnc1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIEludGVybmFsRXZlbnROYW1lLnJlbW90ZVN0ZG91dDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25SZW1vdGVTdGRvdXQgJiYgdGhpcy5vblJlbW90ZVN0ZG91dChhcmdzWzBdLCBhcmdzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgSW50ZXJuYWxFdmVudE5hbWUucnVubmluZ1N0YXRlQ2hhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJ1bm5pbmdTdGF0ZUNoYW5nZSAmJiB0aGlzLm9uUnVubmluZ1N0YXRlQ2hhbmdlKGFyZ3NbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBJbnRlcm5hbEV2ZW50TmFtZS51cGRhdGVSZXNvdXJjZVVzYWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblVwZGF0ZVJlc291cmNlVXNhZ2UgJiYgdGhpcy5vblVwZGF0ZVJlc291cmNlVXNhZ2UoYXJnc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UgJiYgdGhpcy5vbk1lc3NhZ2UoZXZlbnROYW1lLnRvU3RyaW5nKCksIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ZCR6L+c56uv5Y+R6YCB5LqL5Lu2XHJcbiAgICAgKiBcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUg5LqL5Lu25ZCNXHJcbiAgICAgKiBAcGFyYW0gey4uLmFueVtdfSBhcmdzIOWPguaVsFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgU2VydmljZUNvbnRyb2xsZXJcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHNlbmRNZXNzYWdlKGV2ZW50TmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIC8v5LiN5YWB6K645Y+R6YCB5pWw5a2X57G75Z6L55qE5LqL5Lu25ZCN5piv5Li65LqG6YG/5YWN5LiO5YaF6YOo5LqL5Lu25ZCN55u45Yay56qBXHJcbiAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoZXZlbnROYW1lLCBhcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAmuefpeWFs+mXrei/nOeoi+acjeWKoVxyXG4gICAgICogQG1lbWJlck9mIFNlcnZpY2VDb250cm9sbGVyXHJcbiAgICAgKi9cclxuICAgIGNsb3NlU2VydmljZSgpIHtcclxuICAgICAgICB0aGlzLnBvcnQuc2VuZEludGVybmFsTWVzc2FnZShJbnRlcm5hbEV2ZW50TmFtZS5jbG9zZSk7XHJcbiAgICB9XHJcbn0iXX0=
