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
    constructor(remoteServiceName, port) {
        super('__Controller__', port);
        this.exportPrivateServices = {
            close: () => {
                this.close();
            },
            stop: () => {
                this.stop();
            }
        };
        this.remoteServiceName = remoteServiceName;
        //代理远端
        this.remote = {
            services: new Proxy(this.sendInvoke.bind(this, false, this.remoteServiceName), {
                get(target, functionName) {
                    return target.bind(undefined, functionName);
                }
            }),
            privateServices: new Proxy(this.sendInvoke.bind(this, true, this.remoteServiceName), {
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
    async execute(jsCode) {
        if (this.remote.runningState === RunningState.initialized) {
            await this.remote.privateServices.execute(jsCode);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UvU2VydmljZUNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOzs7QUFFSCxpREFBMEM7QUFDMUMsc0RBQStDO0FBRy9DLHNEQUErQztBQUUvQyxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDcEIsNkRBQVcsQ0FBQTtJQUNYLHFEQUFPLENBQUE7SUFDUCwrQ0FBSSxDQUFBO0lBQ0osbURBQU0sQ0FBQSxDQUFVLGVBQWU7QUFDbkMsQ0FBQyxFQUxXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBS3ZCO0FBYUQsdUJBQStCLFNBQVEsc0JBQVk7SUFjL0MsWUFBWSxpQkFBeUIsRUFBRSxJQUFvQjtRQUN2RCxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFieEIsMEJBQXFCLEdBQUc7WUFDOUIsS0FBSyxFQUFFO2dCQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQixDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixDQUFDO1NBQ0osQ0FBQztRQU9FLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUUzQyxNQUFNO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUNoRixHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDaEQsQ0FBQzthQUNKLENBQUM7WUFDRixlQUFlLEVBQUUsSUFBSSxLQUFLLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDdEYsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZO29CQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ2hELENBQUM7YUFDSixDQUFDO1lBQ0YsS0FBSyxFQUFFLElBQUkscUJBQVcsRUFBRTtZQUN4QixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsU0FBUztZQUN0QixNQUFNLEVBQUUsRUFBRTtZQUNWLFlBQVksRUFBRSxZQUFZLENBQUMsV0FBVztZQUN0QyxTQUFTLEVBQUUsU0FBUztTQUN2QixDQUFDO1FBRUYsWUFBWTtRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFXLEVBQUUsTUFBYztZQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVTtRQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEtBQW1CO1lBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILGVBQWU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBUTtZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0JBQW9CO0lBQ3BCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBYztRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7SUFDUixLQUFLLENBQUMsS0FBSztRQUNQLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ04sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFUyxhQUFhLENBQUMsT0FBb0I7UUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsQ0FBQztDQUNKO0FBakZELDhDQWlGQyIsImZpbGUiOiJzZXJ2aWNlL1NlcnZpY2VDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogICDov5znq6/mnI3liqHmjqfliLblmahcclxuICogICDmjqfliLblmajkuZ/mmK/kuIDkuKrmnI3liqHvvIzlj6rkuI3ov4fov5nkuKrmnI3liqHlj6rog73lkJHlroPmiYDlr7nlupTnmoTov5znq6/mj5DkvpvmnI3liqHvvIzlkIzml7bkuZ/lj6rog73osIPnlKjlroPmiYDlr7nlupTnmoTov5znq6/mj5DkvpvnmoTmnI3liqFcclxuICovXHJcblxyXG5pbXBvcnQgQmFzaWNTZXJ2aWNlIGZyb20gXCIuL0Jhc2ljU2VydmljZVwiO1xyXG5pbXBvcnQgRXZlbnRFbWl0ZXIgZnJvbSBcIi4uL3Rvb2xzL0V2ZW50RW1pdGVyXCI7XHJcbmltcG9ydCBNZXNzYWdlRGF0YSBmcm9tIFwiLi4vdG9vbHMvTWVzc2FnZURhdGFcIjtcclxuaW1wb3J0IENvbm5lY3Rpb25Qb3J0IGZyb20gXCIuLi90b29scy9Db25uZWN0aW9uUG9ydFwiO1xyXG5pbXBvcnQgUmVtb3RlRXJyb3IgZnJvbSBcIi4uL3Rvb2xzL1JlbW90ZUVycm9yXCI7XHJcblxyXG5leHBvcnQgZW51bSBSdW5uaW5nU3RhdGUge1xyXG4gICAgaW5pdGlhbGl6ZWQsICAgIC8v6L+c56uv546v5aKD5bey57uP5Yid5aeL5YyW5aW977yM562J5b6F6L+Q6KGM5Luj56CBXHJcbiAgICBydW5uaW5nLCAgICAgICAgLy/mraPlnKjov5DooYzku6PnoIFcclxuICAgIHN0b3AsICAgICAgICAgICAvL+aaguWBnOS7o+eggeaJp+ihjFxyXG4gICAgY2xvc2VkICAgICAgICAgIC8v57uI5q2i6L+c56uv5Luj56CB5omn6KGM5bm26ZSA5q+B546v5aKDXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVtb3RlIHtcclxuICAgIHNlcnZpY2VzOiBhbnk7ICAgICAgICAgICAgICAgICAgLy/ku6PnkIbov5znq6/nmoTlhazlvIDmnI3liqFcclxuICAgIHByaXZhdGVTZXJ2aWNlczogYW55OyAgICAgICAgICAgLy/ku6PnkIbov5znq6/np4HmnInmnI3liqFcclxuICAgIGV2ZW50OiBFdmVudEVtaXRlcjsgICAgICAgICAgICAgLy/ov5znq6/lj5Hov4fmnaXnmoTkuovku7ZcclxuICAgIGNwdVVzYWdlOiBOdW1iZXI7ICAgICAgICAgICAgICAgLy9jcHXntK/orqHmtojogJfvvIjku4DkuYjljZXkvY3vvIlcclxuICAgIG1lbW9yeVVzYWdlOiBOdW1iZXI7ICAgICAgICAgICAgLy/lhoXlrZjmtojogJfvvIhieXRl77yJXHJcbiAgICBlcnJvcnM6IEFycmF5PEVycm9yPjsgICAgICAgICAgIC8v6L+c56uv5Y+R55Sf55qE5pyq5o2V6I636ZSZ6K+vXHJcbiAgICBydW5uaW5nU3RhdGU6IFJ1bm5pbmdTdGF0ZTsgICAgIC8v546w5Zyo55qE6L+Q6KGM54q25oCBXHJcbiAgICBzdGFydFRpbWU6IERhdGU7ICAgICAgICAgICAgICAgIC8v6L+c56uv5pyN5Yqh5ZCv5Yqo5LqL5Lu2XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciBleHRlbmRzIEJhc2ljU2VydmljZSB7XHJcblxyXG4gICAgcHJvdGVjdGVkIGV4cG9ydFByaXZhdGVTZXJ2aWNlcyA9IHtcclxuICAgICAgICBjbG9zZTogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdG9wOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmVhZG9ubHkgcmVtb3RlU2VydmljZU5hbWU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IHJlbW90ZTogUmVtb3RlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlbW90ZVNlcnZpY2VOYW1lOiBzdHJpbmcsIHBvcnQ6IENvbm5lY3Rpb25Qb3J0KSB7XHJcbiAgICAgICAgc3VwZXIoJ19fQ29udHJvbGxlcl9fJywgcG9ydCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdGVTZXJ2aWNlTmFtZSA9IHJlbW90ZVNlcnZpY2VOYW1lO1xyXG5cclxuICAgICAgICAvL+S7o+eQhui/nOerr1xyXG4gICAgICAgIHRoaXMucmVtb3RlID0ge1xyXG4gICAgICAgICAgICBzZXJ2aWNlczogbmV3IFByb3h5PGFueT4odGhpcy5zZW5kSW52b2tlLmJpbmQodGhpcywgZmFsc2UsIHRoaXMucmVtb3RlU2VydmljZU5hbWUpLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQodGFyZ2V0LCBmdW5jdGlvbk5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmJpbmQodW5kZWZpbmVkLCBmdW5jdGlvbk5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgcHJpdmF0ZVNlcnZpY2VzOiBuZXcgUHJveHk8YW55Pih0aGlzLnNlbmRJbnZva2UuYmluZCh0aGlzLCB0cnVlLCB0aGlzLnJlbW90ZVNlcnZpY2VOYW1lKSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0KHRhcmdldCwgZnVuY3Rpb25OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5iaW5kKHVuZGVmaW5lZCwgZnVuY3Rpb25OYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGV2ZW50OiBuZXcgRXZlbnRFbWl0ZXIoKSxcclxuICAgICAgICAgICAgY3B1VXNhZ2U6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbWVtb3J5VXNhZ2U6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgZXJyb3JzOiBbXSxcclxuICAgICAgICAgICAgcnVubmluZ1N0YXRlOiBSdW5uaW5nU3RhdGUuaW5pdGlhbGl6ZWQsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogdW5kZWZpbmVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy/mm7TmlrDnoazku7botYTmupDkvb/nlKjnirbmgIFcclxuICAgICAgICB0aGlzLnJlbW90ZS5ldmVudC5vbigncHJvY2Vzc1VzYWdlJywgKGNwdTogbnVtYmVyLCBtZW1vcnk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW90ZS5jcHVVc2FnZSA9IGNwdTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGUubWVtb3J5VXNhZ2UgPSBtZW1vcnk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v6L+Q6KGM54q25oCB5Y+R55Sf5pS55Y+YXHJcbiAgICAgICAgdGhpcy5yZW1vdGUuZXZlbnQub24oJ3J1bm5pbmdTdGF0ZUNoYW5nZScsIChzdGF0ZTogUnVubmluZ1N0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3RlLnJ1bm5pbmdTdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL+i/nOerr+i/kOihjOaXtuWHuueOsOacquaNleiOt+eahOW8guW4uFxyXG4gICAgICAgIHRoaXMucmVtb3RlLmV2ZW50Lm9uKCdlcnJvcicsIChlcnI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW90ZS5lcnJvcnMucHVzaChuZXcgUmVtb3RlRXJyb3IoZXJyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/lnKjov5znq6/miafooYzku6PnoIHvvIzov5nkuKrmlrnms5Xlj6rog73miafooYzkuIDmrKFcclxuICAgIGFzeW5jIGV4ZWN1dGUoanNDb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW1vdGUucnVubmluZ1N0YXRlID09PSBSdW5uaW5nU3RhdGUuaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLmV4ZWN1dGUoanNDb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGUuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvZGUgaGFzIGJlZW4gZXhlY3V0ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/lhbPpl63ov5znq6/ov5DooYxcclxuICAgIGFzeW5jIGNsb3NlKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVtb3RlLnByaXZhdGVTZXJ2aWNlcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLnN0b3AoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZXN1bWUoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLnJlc3VtZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVjZWl2ZUV2ZW50KG1lc3NhZ2U6IE1lc3NhZ2VEYXRhKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdGUuZXZlbnQuZW1pdChtZXNzYWdlLnRyaWdnZXJOYW1lLCAuLi5tZXNzYWdlLmFyZ3MpO1xyXG4gICAgfVxyXG59Il19
