/*
*   远端服务控制器
*   控制器也是一个服务，只不过这个服务只能向它所对应的远端提供服务，同时也只能调用它所对应的远端提供的服务
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicService_1 = require("./BasicService");
const EventEmiter_1 = require("../tools/EventEmiter");
const RemoteError_1 = require("../tools/RemoteError");
var RunningState;
(function (RunningState) {
    RunningState[RunningState["initialized"] = 0] = "initialized";
    RunningState[RunningState["running"] = 1] = "running";
    RunningState[RunningState["stop"] = 2] = "stop";
    RunningState[RunningState["closed"] = 3] = "closed"; //终止远端代码执行并销毁环境
})(RunningState = exports.RunningState || (exports.RunningState = {}));
class ServiceController extends BasicService_1.default {
    constructor(jsCode, port) {
        super('__Controller__', port);
        this.exportPrivateServices = {
            close: () => {
                this.close();
            },
            stop: () => {
                this.stop();
            }
        };
        this.remote = {
            services: new Proxy(this.sendInvoke.bind(this, false, this.serviceName), {
                get(target, functionName) {
                    return target.bind(undefined, functionName);
                }
            }),
            privateServices: new Proxy(this.sendInvoke.bind(this, true, this.serviceName), {
                get(target, functionName) {
                    return target.bind(undefined, functionName);
                }
            }),
            event: new EventEmiter_1.default(),
            cpuUsage: undefined,
            memoryUsage: undefined,
            errors: [],
            runningState: RunningState.initialized,
            startTime: undefined
        };
        this.jsCode = jsCode;
        //更新硬件资源使用状态
        this.remote.event.on('processUsage', (cpu, memory) => {
            this.remote.cpuUsage = cpu;
            this.remote.memoryUsage = memory;
        });
        //运行状态发生改变
        this.remote.event.on('runningStateChange', (state) => {
            this.remote.runningState = state;
        });
        //远端运行时出现未捕获的异常
        this.remote.event.on('error', (err) => {
            this.remote.errors.push(new RemoteError_1.default(err));
        });
    }
    //在远端执行代码，这个方法只能执行一次
    async execute() {
        if (this.remote.runningState === RunningState.initialized) {
            await this.remote.privateServices.execute(this.jsCode);
            this.remote.startTime = new Date();
        }
        else {
            throw new Error('code has been executed');
        }
    }
    //关闭远端运行
    async close() {
        await this.remote.privateServices.close();
    }
    async stop() {
        await this.remote.privateServices.stop();
    }
    async resume() {
        await this.remote.privateServices.resume();
    }
    _receiveEvent(message) {
        this.remote.event.emit(message.triggerName, ...message.args);
    }
}
exports.ServiceController = ServiceController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UvU2VydmljZUNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztFQUdFOzs7QUFFRixpREFBMEM7QUFDMUMsc0RBQStDO0FBRy9DLHNEQUErQztBQUUvQyxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDcEIsNkRBQVcsQ0FBQTtJQUNYLHFEQUFPLENBQUE7SUFDUCwrQ0FBSSxDQUFBO0lBQ0osbURBQU0sQ0FBQSxDQUFVLGVBQWU7QUFDbkMsQ0FBQyxFQUxXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBS3ZCO0FBYUQsdUJBQStCLFNBQVEsc0JBQVk7SUFnQy9DLFlBQVksTUFBYyxFQUFFLElBQW9CO1FBQzVDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQTdCeEIsMEJBQXFCLEdBQUc7WUFDOUIsS0FBSyxFQUFFO2dCQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQixDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixDQUFDO1NBQ0osQ0FBQztRQUVPLFdBQU0sR0FBVztZQUN0QixRQUFRLEVBQUUsSUFBSSxLQUFLLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2FBQ0osQ0FBQztZQUNGLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDaEYsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZO29CQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ2hELENBQUM7YUFDSixDQUFDO1lBQ0YsS0FBSyxFQUFFLElBQUkscUJBQVcsRUFBRTtZQUN4QixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsU0FBUztZQUN0QixNQUFNLEVBQUUsRUFBRTtZQUNWLFlBQVksRUFBRSxZQUFZLENBQUMsV0FBVztZQUN0QyxTQUFTLEVBQUUsU0FBUztTQUN2QixDQUFDO1FBSUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsWUFBWTtRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFXLEVBQUUsTUFBYztZQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVTtRQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEtBQW1CO1lBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILGVBQWU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBUTtZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0JBQW9CO0lBQ3BCLEtBQUssQ0FBQyxPQUFPO1FBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEtBQUssWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUTtJQUNSLEtBQUssQ0FBQyxLQUFLO1FBQ1AsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDTixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtRQUNSLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVTLGFBQWEsQ0FBQyxPQUFvQjtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBQ0o7QUEvRUQsOENBK0VDIiwiZmlsZSI6InNlcnZpY2UvU2VydmljZUNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qICAg6L+c56uv5pyN5Yqh5o6n5Yi25ZmoXHJcbiogICDmjqfliLblmajkuZ/mmK/kuIDkuKrmnI3liqHvvIzlj6rkuI3ov4fov5nkuKrmnI3liqHlj6rog73lkJHlroPmiYDlr7nlupTnmoTov5znq6/mj5DkvpvmnI3liqHvvIzlkIzml7bkuZ/lj6rog73osIPnlKjlroPmiYDlr7nlupTnmoTov5znq6/mj5DkvpvnmoTmnI3liqFcclxuKi9cclxuXHJcbmltcG9ydCBCYXNpY1NlcnZpY2UgZnJvbSBcIi4vQmFzaWNTZXJ2aWNlXCI7XHJcbmltcG9ydCBFdmVudEVtaXRlciBmcm9tIFwiLi4vdG9vbHMvRXZlbnRFbWl0ZXJcIjtcclxuaW1wb3J0IE1lc3NhZ2VEYXRhIGZyb20gXCIuLi90b29scy9NZXNzYWdlRGF0YVwiO1xyXG5pbXBvcnQgQ29ubmVjdGlvblBvcnQgZnJvbSBcIi4uL3Rvb2xzL0Nvbm5lY3Rpb25Qb3J0XCI7XHJcbmltcG9ydCBSZW1vdGVFcnJvciBmcm9tIFwiLi4vdG9vbHMvUmVtb3RlRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBlbnVtIFJ1bm5pbmdTdGF0ZSB7XHJcbiAgICBpbml0aWFsaXplZCwgICAgLy/ov5znq6/njq/looPlt7Lnu4/liJ3lp4vljJblpb3vvIznrYnlvoXov5DooYzku6PnoIFcclxuICAgIHJ1bm5pbmcsICAgICAgICAvL+ato+WcqOi/kOihjOS7o+eggVxyXG4gICAgc3RvcCwgICAgICAgICAgIC8v5pqC5YGc5Luj56CB5omn6KGMXHJcbiAgICBjbG9zZWQgICAgICAgICAgLy/nu4jmraLov5znq6/ku6PnoIHmiafooYzlubbplIDmr4Hnjq/looNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZW1vdGUge1xyXG4gICAgc2VydmljZXM6IGFueTsgICAgICAgICAgICAgICAgICAvL+S7o+eQhui/nOerr+eahOWFrOW8gOacjeWKoVxyXG4gICAgcHJpdmF0ZVNlcnZpY2VzOiBhbnk7ICAgICAgICAgICAvL+S7o+eQhui/nOerr+engeacieacjeWKoVxyXG4gICAgZXZlbnQ6IEV2ZW50RW1pdGVyOyAgICAgICAgICAgICAvL+i/nOerr+WPkei/h+adpeeahOS6i+S7tlxyXG4gICAgY3B1VXNhZ2U6IE51bWJlcjsgICAgICAgICAgICAgICAvL2Nwdee0r+iuoea2iOiAl++8iOS7gOS5iOWNleS9je+8iVxyXG4gICAgbWVtb3J5VXNhZ2U6IE51bWJlcjsgICAgICAgICAgICAvL+WGheWtmOa2iOiAl++8iGJ5dGXvvIlcclxuICAgIGVycm9yczogQXJyYXk8RXJyb3I+OyAgICAgICAgICAgLy/ov5znq6/lj5HnlJ/nmoTmnKrmjZXojrfplJnor69cclxuICAgIHJ1bm5pbmdTdGF0ZTogUnVubmluZ1N0YXRlOyAgICAgLy/njrDlnKjnmoTov5DooYznirbmgIFcclxuICAgIHN0YXJ0VGltZTogRGF0ZTsgICAgICAgICAgICAgICAgLy/ov5znq6/mnI3liqHlkK/liqjkuovku7ZcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIGV4dGVuZHMgQmFzaWNTZXJ2aWNlIHtcclxuXHJcbiAgICByZWFkb25seSBqc0NvZGU6IHN0cmluZztcclxuXHJcbiAgICBwcm90ZWN0ZWQgZXhwb3J0UHJpdmF0ZVNlcnZpY2VzID0ge1xyXG4gICAgICAgIGNsb3NlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0b3A6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZWFkb25seSByZW1vdGU6IFJlbW90ZSA9IHtcclxuICAgICAgICBzZXJ2aWNlczogbmV3IFByb3h5PGFueT4odGhpcy5zZW5kSW52b2tlLmJpbmQodGhpcywgZmFsc2UsIHRoaXMuc2VydmljZU5hbWUpLCB7XHJcbiAgICAgICAgICAgIGdldCh0YXJnZXQsIGZ1bmN0aW9uTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5iaW5kKHVuZGVmaW5lZCwgZnVuY3Rpb25OYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHByaXZhdGVTZXJ2aWNlczogbmV3IFByb3h5PGFueT4odGhpcy5zZW5kSW52b2tlLmJpbmQodGhpcywgdHJ1ZSwgdGhpcy5zZXJ2aWNlTmFtZSksIHtcclxuICAgICAgICAgICAgZ2V0KHRhcmdldCwgZnVuY3Rpb25OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmJpbmQodW5kZWZpbmVkLCBmdW5jdGlvbk5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZXZlbnQ6IG5ldyBFdmVudEVtaXRlcigpLFxyXG4gICAgICAgIGNwdVVzYWdlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgbWVtb3J5VXNhZ2U6IHVuZGVmaW5lZCxcclxuICAgICAgICBlcnJvcnM6IFtdLFxyXG4gICAgICAgIHJ1bm5pbmdTdGF0ZTogUnVubmluZ1N0YXRlLmluaXRpYWxpemVkLFxyXG4gICAgICAgIHN0YXJ0VGltZTogdW5kZWZpbmVkXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGpzQ29kZTogc3RyaW5nLCBwb3J0OiBDb25uZWN0aW9uUG9ydCkge1xyXG4gICAgICAgIHN1cGVyKCdfX0NvbnRyb2xsZXJfXycsIHBvcnQpO1xyXG4gICAgICAgIHRoaXMuanNDb2RlID0ganNDb2RlO1xyXG5cclxuICAgICAgICAvL+abtOaWsOehrOS7tui1hOa6kOS9v+eUqOeKtuaAgVxyXG4gICAgICAgIHRoaXMucmVtb3RlLmV2ZW50Lm9uKCdwcm9jZXNzVXNhZ2UnLCAoY3B1OiBudW1iZXIsIG1lbW9yeTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3RlLmNwdVVzYWdlID0gY3B1O1xyXG4gICAgICAgICAgICB0aGlzLnJlbW90ZS5tZW1vcnlVc2FnZSA9IG1lbW9yeTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy/ov5DooYznirbmgIHlj5HnlJ/mlLnlj5hcclxuICAgICAgICB0aGlzLnJlbW90ZS5ldmVudC5vbigncnVubmluZ1N0YXRlQ2hhbmdlJywgKHN0YXRlOiBSdW5uaW5nU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGUucnVubmluZ1N0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v6L+c56uv6L+Q6KGM5pe25Ye6546w5pyq5o2V6I6355qE5byC5bi4XHJcbiAgICAgICAgdGhpcy5yZW1vdGUuZXZlbnQub24oJ2Vycm9yJywgKGVycjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3RlLmVycm9ycy5wdXNoKG5ldyBSZW1vdGVFcnJvcihlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL+WcqOi/nOerr+aJp+ihjOS7o+egge+8jOi/meS4quaWueazleWPquiDveaJp+ihjOS4gOasoVxyXG4gICAgYXN5bmMgZXhlY3V0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW1vdGUucnVubmluZ1N0YXRlID09PSBSdW5uaW5nU3RhdGUuaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLmV4ZWN1dGUodGhpcy5qc0NvZGUpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW90ZS5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY29kZSBoYXMgYmVlbiBleGVjdXRlZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+WFs+mXrei/nOerr+i/kOihjFxyXG4gICAgYXN5bmMgY2xvc2UoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc3RvcCgpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnJlbW90ZS5wcml2YXRlU2VydmljZXMuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlc3VtZSgpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnJlbW90ZS5wcml2YXRlU2VydmljZXMucmVzdW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZWNlaXZlRXZlbnQobWVzc2FnZTogTWVzc2FnZURhdGEpIHtcclxuICAgICAgICB0aGlzLnJlbW90ZS5ldmVudC5lbWl0KG1lc3NhZ2UudHJpZ2dlck5hbWUsIC4uLm1lc3NhZ2UuYXJncyk7XHJcbiAgICB9XHJcbn0iXX0=
