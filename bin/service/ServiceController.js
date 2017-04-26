/*
*   远端服务控制器
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicService_1 = require("./BasicService");
const EventEmiter_1 = require("../tools/EventEmiter");
var RunningState;
(function (RunningState) {
    RunningState[RunningState["initialized"] = 0] = "initialized";
    RunningState[RunningState["running"] = 1] = "running";
    RunningState[RunningState["stop"] = 2] = "stop";
    RunningState[RunningState["closed"] = 3] = "closed"; //终止远端代码执行并销毁环境
})(RunningState = exports.RunningState || (exports.RunningState = {}));
class ServiceController extends BasicService_1.default {
    constructor(serviceName, jsCode, port) {
        super(serviceName, port);
        this.remote = {
            privateServices: new Proxy(this.sendInvoke.bind(this, true, ''), {
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
    }
    async start() {
        if (this.remote.runningState === RunningState.initialized) {
            await this.remote.privateServices.start(this.jsCode);
            this.remote.startTime = new Date();
            this.remote.runningState = RunningState.running;
        }
    }
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
        this.remote.event.emit(message.triggerName, message.args);
    }
}
exports.default = ServiceController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UvU2VydmljZUNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7O0VBRUU7OztBQUVGLGlEQUEwQztBQUMxQyxzREFBK0M7QUFJL0MsSUFBWSxZQUtYO0FBTEQsV0FBWSxZQUFZO0lBQ3BCLDZEQUFXLENBQUE7SUFDWCxxREFBTyxDQUFBO0lBQ1AsK0NBQUksQ0FBQTtJQUNKLG1EQUFNLENBQUEsQ0FBVSxlQUFlO0FBQ25DLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtBQVlELHVCQUF3QixTQUFRLHNCQUFZO0lBa0J4QyxZQUFZLFdBQW1CLEVBQUUsTUFBYyxFQUFFLElBQW9CO1FBQ2pFLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFmN0IsV0FBTSxHQUFXO1lBQ2IsZUFBZSxFQUFFLElBQUksS0FBSyxDQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ2xFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2FBQ0osQ0FBQztZQUNGLEtBQUssRUFBRSxJQUFJLHFCQUFXLEVBQUU7WUFDeEIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLFNBQVM7WUFDdEIsTUFBTSxFQUFFLEVBQUU7WUFDVixZQUFZLEVBQUUsWUFBWSxDQUFDLFdBQVc7WUFDdEMsU0FBUyxFQUFFLFNBQVM7U0FDdkIsQ0FBQztRQUlFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNQLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxLQUFLLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUM7UUFDcEQsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNQLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ04sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFUyxhQUFhLENBQUMsT0FBb0I7UUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlELENBQUM7Q0FDSjtBQUVELGtCQUFlLGlCQUFpQixDQUFDIiwiZmlsZSI6InNlcnZpY2UvU2VydmljZUNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLypcclxuKiAgIOi/nOerr+acjeWKoeaOp+WItuWZqFxyXG4qL1xyXG5cclxuaW1wb3J0IEJhc2ljU2VydmljZSBmcm9tIFwiLi9CYXNpY1NlcnZpY2VcIjtcclxuaW1wb3J0IEV2ZW50RW1pdGVyIGZyb20gXCIuLi90b29scy9FdmVudEVtaXRlclwiO1xyXG5pbXBvcnQgTWVzc2FnZURhdGEgZnJvbSBcIi4uL3Rvb2xzL01lc3NhZ2VEYXRhXCI7XHJcbmltcG9ydCBDb25uZWN0aW9uUG9ydCBmcm9tIFwiLi4vdG9vbHMvQ29ubmVjdGlvblBvcnRcIjtcclxuXHJcbmV4cG9ydCBlbnVtIFJ1bm5pbmdTdGF0ZSB7XHJcbiAgICBpbml0aWFsaXplZCwgICAgLy/ov5znq6/njq/looPlt7Lnu4/liJ3lp4vljJblpb3vvIznrYnlvoXov5DooYzku6PnoIFcclxuICAgIHJ1bm5pbmcsICAgICAgICAvL+ato+WcqOi/kOihjOS7o+eggVxyXG4gICAgc3RvcCwgICAgICAgICAgIC8v5pqC5YGc5Luj56CB5omn6KGMXHJcbiAgICBjbG9zZWQgICAgICAgICAgLy/nu4jmraLov5znq6/ku6PnoIHmiafooYzlubbplIDmr4Hnjq/looNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZW1vdGUge1xyXG4gICAgcHJpdmF0ZVNlcnZpY2VzOiBhbnk7ICAgICAgICAgICAvL+S7o+eQhui/nOerr+engeacieacjeWKoVxyXG4gICAgZXZlbnQ6IEV2ZW50RW1pdGVyOyAgICAgICAgICAgICAvL+i/nOerr+WPkei/h+adpeeahOS6i+S7tlxyXG4gICAgY3B1VXNhZ2U6IE51bWJlcjsgICAgICAgICAgICAgICAvL2Nwdee0r+iuoea2iOiAl++8iOS7gOS5iOWNleS9je+8iVxyXG4gICAgbWVtb3J5VXNhZ2U6IE51bWJlcjsgICAgICAgICAgICAvL+WGheWtmOa2iOiAl++8iGJ5dGXvvIlcclxuICAgIGVycm9yczogQXJyYXk8RXJyb3I+OyAgICAgICAgICAgLy/ov5znq6/lj5HnlJ/nmoTmnKrmjZXojrfplJnor69cclxuICAgIHJ1bm5pbmdTdGF0ZTogUnVubmluZ1N0YXRlOyAgICAgLy/njrDlnKjnmoTov5DooYznirbmgIFcclxuICAgIHN0YXJ0VGltZTogRGF0ZTsgICAgICAgICAgICAgICAgLy/ov5znq6/mnI3liqHlkK/liqjkuovku7ZcclxufVxyXG5cclxuY2xhc3MgU2VydmljZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNpY1NlcnZpY2Uge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkganNDb2RlOiBzdHJpbmc7XHJcblxyXG4gICAgcmVtb3RlOiBSZW1vdGUgPSB7XHJcbiAgICAgICAgcHJpdmF0ZVNlcnZpY2VzOiBuZXcgUHJveHk8YW55Pih0aGlzLnNlbmRJbnZva2UuYmluZCh0aGlzLCB0cnVlLCAnJyksIHtcclxuICAgICAgICAgICAgZ2V0KHRhcmdldCwgZnVuY3Rpb25OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmJpbmQodW5kZWZpbmVkLCBmdW5jdGlvbk5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZXZlbnQ6IG5ldyBFdmVudEVtaXRlcigpLFxyXG4gICAgICAgIGNwdVVzYWdlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgbWVtb3J5VXNhZ2U6IHVuZGVmaW5lZCxcclxuICAgICAgICBlcnJvcnM6IFtdLFxyXG4gICAgICAgIHJ1bm5pbmdTdGF0ZTogUnVubmluZ1N0YXRlLmluaXRpYWxpemVkLFxyXG4gICAgICAgIHN0YXJ0VGltZTogdW5kZWZpbmVkXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2VOYW1lOiBzdHJpbmcsIGpzQ29kZTogc3RyaW5nLCBwb3J0OiBDb25uZWN0aW9uUG9ydCkge1xyXG4gICAgICAgIHN1cGVyKHNlcnZpY2VOYW1lLCBwb3J0KTtcclxuICAgICAgICB0aGlzLmpzQ29kZSA9IGpzQ29kZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW1vdGUucnVubmluZ1N0YXRlID09PSBSdW5uaW5nU3RhdGUuaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLnN0YXJ0KHRoaXMuanNDb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGUuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGUucnVubmluZ1N0YXRlID0gUnVubmluZ1N0YXRlLnJ1bm5pbmc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGNsb3NlKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVtb3RlLnByaXZhdGVTZXJ2aWNlcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLnN0b3AoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZXN1bWUoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW1vdGUucHJpdmF0ZVNlcnZpY2VzLnJlc3VtZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVjZWl2ZUV2ZW50KG1lc3NhZ2U6IE1lc3NhZ2VEYXRhKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdGUuZXZlbnQuZW1pdChtZXNzYWdlLnRyaWdnZXJOYW1lLCBtZXNzYWdlLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlQ29udHJvbGxlcjsiXX0=
