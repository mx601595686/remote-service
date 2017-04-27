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
    constructor(port) {
        super(port);
        this.exportPrivateServices = {
            close: () => {
                this.close();
            },
            stop: () => {
                this.stop();
            }
        };
        this.remoteServiceName = port.serviceName;
        port.serviceName = ServiceController.controllerName;
        port.importServices.length = 0;
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
ServiceController.controllerName = '__Controller__'; //控制器的名称
exports.ServiceController = ServiceController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UvU2VydmljZUNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOzs7QUFFSCxpREFBMEM7QUFDMUMsc0RBQStDO0FBRy9DLHNEQUErQztBQUUvQyxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDcEIsNkRBQVcsQ0FBQTtJQUNYLHFEQUFPLENBQUE7SUFDUCwrQ0FBSSxDQUFBO0lBQ0osbURBQU0sQ0FBQSxDQUFVLGVBQWU7QUFDbkMsQ0FBQyxFQUxXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBS3ZCO0FBYUQsdUJBQStCLFNBQVEsc0JBQVk7SUFnQi9DLFlBQVksSUFBb0I7UUFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBYk4sMEJBQXFCLEdBQUc7WUFDOUIsS0FBSyxFQUFFO2dCQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQixDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixDQUFDO1NBQ0osQ0FBQztRQVFFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUMsY0FBYyxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUUvQixNQUFNO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUNoRixHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDaEQsQ0FBQzthQUNKLENBQUM7WUFDRixlQUFlLEVBQUUsSUFBSSxLQUFLLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDdEYsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZO29CQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ2hELENBQUM7YUFDSixDQUFDO1lBQ0YsS0FBSyxFQUFFLElBQUkscUJBQVcsRUFBRTtZQUN4QixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsU0FBUztZQUN0QixNQUFNLEVBQUUsRUFBRTtZQUNWLFlBQVksRUFBRSxZQUFZLENBQUMsV0FBVztZQUN0QyxTQUFTLEVBQUUsU0FBUztTQUN2QixDQUFDO1FBRUYsWUFBWTtRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFXLEVBQUUsTUFBYztZQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVTtRQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEtBQW1CO1lBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILGVBQWU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBUTtZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0JBQW9CO0lBQ3BCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBYztRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7SUFDUixLQUFLLENBQUMsS0FBSztRQUNQLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ04sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFUyxhQUFhLENBQUMsT0FBb0I7UUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsQ0FBQzs7QUFuRk0sZ0NBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFHLFFBQVE7QUFGeEQsOENBc0ZDIiwiZmlsZSI6InNlcnZpY2UvU2VydmljZUNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiAgIOi/nOerr+acjeWKoeaOp+WItuWZqFxyXG4gKiAgIOaOp+WItuWZqOS5n+aYr+S4gOS4quacjeWKoe+8jOWPquS4jei/h+i/meS4quacjeWKoeWPquiDveWQkeWug+aJgOWvueW6lOeahOi/nOerr+aPkOS+m+acjeWKoe+8jOWQjOaXtuS5n+WPquiDveiwg+eUqOWug+aJgOWvueW6lOeahOi/nOerr+aPkOS+m+eahOacjeWKoVxyXG4gKi9cclxuXHJcbmltcG9ydCBCYXNpY1NlcnZpY2UgZnJvbSBcIi4vQmFzaWNTZXJ2aWNlXCI7XHJcbmltcG9ydCBFdmVudEVtaXRlciBmcm9tIFwiLi4vdG9vbHMvRXZlbnRFbWl0ZXJcIjtcclxuaW1wb3J0IE1lc3NhZ2VEYXRhIGZyb20gXCIuLi90b29scy9NZXNzYWdlRGF0YVwiO1xyXG5pbXBvcnQgQ29ubmVjdGlvblBvcnQgZnJvbSBcIi4uL3Rvb2xzL0Nvbm5lY3Rpb25Qb3J0XCI7XHJcbmltcG9ydCBSZW1vdGVFcnJvciBmcm9tIFwiLi4vdG9vbHMvUmVtb3RlRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBlbnVtIFJ1bm5pbmdTdGF0ZSB7XHJcbiAgICBpbml0aWFsaXplZCwgICAgLy/ov5znq6/njq/looPlt7Lnu4/liJ3lp4vljJblpb3vvIznrYnlvoXov5DooYzku6PnoIFcclxuICAgIHJ1bm5pbmcsICAgICAgICAvL+ato+WcqOi/kOihjOS7o+eggVxyXG4gICAgc3RvcCwgICAgICAgICAgIC8v5pqC5YGc5Luj56CB5omn6KGMXHJcbiAgICBjbG9zZWQgICAgICAgICAgLy/nu4jmraLov5znq6/ku6PnoIHmiafooYzlubbplIDmr4Hnjq/looNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZW1vdGUge1xyXG4gICAgc2VydmljZXM6IGFueTsgICAgICAgICAgICAgICAgICAvL+S7o+eQhui/nOerr+eahOWFrOW8gOacjeWKoVxyXG4gICAgcHJpdmF0ZVNlcnZpY2VzOiBhbnk7ICAgICAgICAgICAvL+S7o+eQhui/nOerr+engeacieacjeWKoVxyXG4gICAgZXZlbnQ6IEV2ZW50RW1pdGVyOyAgICAgICAgICAgICAvL+i/nOerr+WPkei/h+adpeeahOS6i+S7tlxyXG4gICAgY3B1VXNhZ2U6IE51bWJlcjsgICAgICAgICAgICAgICAvL2Nwdee0r+iuoea2iOiAl++8iOS7gOS5iOWNleS9je+8iVxyXG4gICAgbWVtb3J5VXNhZ2U6IE51bWJlcjsgICAgICAgICAgICAvL+WGheWtmOa2iOiAl++8iGJ5dGXvvIlcclxuICAgIGVycm9yczogQXJyYXk8RXJyb3I+OyAgICAgICAgICAgLy/ov5znq6/lj5HnlJ/nmoTmnKrmjZXojrfplJnor69cclxuICAgIHJ1bm5pbmdTdGF0ZTogUnVubmluZ1N0YXRlOyAgICAgLy/njrDlnKjnmoTov5DooYznirbmgIFcclxuICAgIHN0YXJ0VGltZTogRGF0ZTsgICAgICAgICAgICAgICAgLy/ov5znq6/mnI3liqHlkK/liqjkuovku7ZcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIGV4dGVuZHMgQmFzaWNTZXJ2aWNlIHtcclxuXHJcbiAgICBzdGF0aWMgY29udHJvbGxlck5hbWUgPSAnX19Db250cm9sbGVyX18nOyAgIC8v5o6n5Yi25Zmo55qE5ZCN56ewXHJcblxyXG4gICAgcHJvdGVjdGVkIGV4cG9ydFByaXZhdGVTZXJ2aWNlcyA9IHtcclxuICAgICAgICBjbG9zZTogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdG9wOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmVhZG9ubHkgcmVtb3RlU2VydmljZU5hbWU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IHJlbW90ZTogUmVtb3RlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvcnQ6IENvbm5lY3Rpb25Qb3J0KSB7XHJcbiAgICAgICAgc3VwZXIocG9ydCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yZW1vdGVTZXJ2aWNlTmFtZSA9IHBvcnQuc2VydmljZU5hbWU7XHJcbiAgICAgICAgcG9ydC5zZXJ2aWNlTmFtZSA9IFNlcnZpY2VDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lO1xyXG4gICAgICAgIHBvcnQuaW1wb3J0U2VydmljZXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgLy/ku6PnkIbov5znq69cclxuICAgICAgICB0aGlzLnJlbW90ZSA9IHtcclxuICAgICAgICAgICAgc2VydmljZXM6IG5ldyBQcm94eTxhbnk+KHRoaXMuc2VuZEludm9rZS5iaW5kKHRoaXMsIGZhbHNlLCB0aGlzLnJlbW90ZVNlcnZpY2VOYW1lKSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0KHRhcmdldCwgZnVuY3Rpb25OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5iaW5kKHVuZGVmaW5lZCwgZnVuY3Rpb25OYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHByaXZhdGVTZXJ2aWNlczogbmV3IFByb3h5PGFueT4odGhpcy5zZW5kSW52b2tlLmJpbmQodGhpcywgdHJ1ZSwgdGhpcy5yZW1vdGVTZXJ2aWNlTmFtZSksIHtcclxuICAgICAgICAgICAgICAgIGdldCh0YXJnZXQsIGZ1bmN0aW9uTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYmluZCh1bmRlZmluZWQsIGZ1bmN0aW9uTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBldmVudDogbmV3IEV2ZW50RW1pdGVyKCksXHJcbiAgICAgICAgICAgIGNwdVVzYWdlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIG1lbW9yeVVzYWdlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGVycm9yczogW10sXHJcbiAgICAgICAgICAgIHJ1bm5pbmdTdGF0ZTogUnVubmluZ1N0YXRlLmluaXRpYWxpemVkLFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IHVuZGVmaW5lZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8v5pu05paw56Gs5Lu26LWE5rqQ5L2/55So54q25oCBXHJcbiAgICAgICAgdGhpcy5yZW1vdGUuZXZlbnQub24oJ3Byb2Nlc3NVc2FnZScsIChjcHU6IG51bWJlciwgbWVtb3J5OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGUuY3B1VXNhZ2UgPSBjcHU7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3RlLm1lbW9yeVVzYWdlID0gbWVtb3J5O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL+i/kOihjOeKtuaAgeWPkeeUn+aUueWPmFxyXG4gICAgICAgIHRoaXMucmVtb3RlLmV2ZW50Lm9uKCdydW5uaW5nU3RhdGVDaGFuZ2UnLCAoc3RhdGU6IFJ1bm5pbmdTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW90ZS5ydW5uaW5nU3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy/ov5znq6/ov5DooYzml7blh7rnjrDmnKrmjZXojrfnmoTlvILluLhcclxuICAgICAgICB0aGlzLnJlbW90ZS5ldmVudC5vbignZXJyb3InLCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGUuZXJyb3JzLnB1c2gobmV3IFJlbW90ZUVycm9yKGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5Zyo6L+c56uv5omn6KGM5Luj56CB77yM6L+Z5Liq5pa55rOV5Y+q6IO95omn6KGM5LiA5qyhXHJcbiAgICBhc3luYyBleGVjdXRlKGpzQ29kZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVtb3RlLnJ1bm5pbmdTdGF0ZSA9PT0gUnVubmluZ1N0YXRlLmluaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVtb3RlLnByaXZhdGVTZXJ2aWNlcy5leGVjdXRlKGpzQ29kZSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3RlLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb2RlIGhhcyBiZWVuIGV4ZWN1dGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5YWz6Zet6L+c56uv6L+Q6KGMXHJcbiAgICBhc3luYyBjbG9zZSgpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnJlbW90ZS5wcml2YXRlU2VydmljZXMuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdG9wKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVtb3RlLnByaXZhdGVTZXJ2aWNlcy5zdG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVzdW1lKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVtb3RlLnByaXZhdGVTZXJ2aWNlcy5yZXN1bWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlY2VpdmVFdmVudChtZXNzYWdlOiBNZXNzYWdlRGF0YSkge1xyXG4gICAgICAgIHRoaXMucmVtb3RlLmV2ZW50LmVtaXQobWVzc2FnZS50cmlnZ2VyTmFtZSwgLi4ubWVzc2FnZS5hcmdzKTtcclxuICAgIH1cclxufSJdfQ==
