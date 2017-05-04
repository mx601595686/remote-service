//用于处理对应控制器或其他远程服务发送过来的请求和事件。
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RemoteServiceConnectionPort_1 = require("./ConnectionPort/RemoteServiceConnectionPort");
const SimpleEventEmiter_1 = require("./Tools/SimpleEventEmiter");
class RemoteService {
    constructor(serviceName, importServices, port) {
        this.serviceName = serviceName;
        //是否已经关闭服务了
        this.hasClosed = false;
        //导入的服务
        this.importServices = {};
        //导出的服务
        this.exportServices = {};
        this.port = new RemoteServiceConnectionPort_1.default(serviceName, importServices, port);
        //是否已经执行了服务代码
        let hasExecuteServiceCode = false;
        //网络连接出现错误就关闭服务
        this.port.onConnectionError = () => this.onClose();
        //当接收到内部消息
        this.port.onInternalMessage = (eventName, args) => {
            switch (eventName) {
                case 2 /* close */: {
                    this.closeService();
                    break;
                }
                case 1 /* executeServiceCode */: {
                    if (!hasExecuteServiceCode) {
                        hasExecuteServiceCode = true;
                        this.onExecuteCode(args[0])
                            .then(() => {
                            this.port.sendInternalMessage(3 /* runningStateChange */, 1 /* running */);
                        })
                            .catch((err) => {
                            this.port.sendInternalMessage(4 /* remoteServiceError */, { message: err.message, stack: err.stack });
                            this.closeService();
                        });
                    }
                    break;
                }
                default: {
                    this.onInternalMessage && this.onInternalMessage(eventName.toString(), args);
                    break;
                }
            }
        };
        //初始化导入的服务
        this.port.importServices.forEach((serviceName) => {
            this.importServices[serviceName] = {
                services: new Proxy(this.port.sendInvoke.bind(this.port, serviceName), {
                    get(target, functionName) {
                        return target.bind(undefined, functionName);
                    }
                }),
                event: new SimpleEventEmiter_1.default() //接受对应服务的事件
            };
        });
        //当接收到依赖服务发来的事件
        this.port.onEventMessage = (sender, eventName, args) => {
            this.importServices[sender].event.emit(eventName, ...args);
        };
        //处理远端服务调用请求
        this.port.onInvokeMessage = async (functionName, args) => {
            return await this.exportServices[functionName](...args);
        };
        //公开发送事件方法
        this.sendEvent = this.port.sendEventMessage.bind(this.port);
        //通知远端已准备好了
        setTimeout(() => {
            this.port.sendInternalMessage(0 /* remoteReady */);
        }, 10);
    }
    /**
     * 通知服务控制器资源消耗情况
     *
     * @protected
     * @param {ResourceUsageInformation} state 源消耗情况
     *
     * @memberof RemoteService
     */
    onUpdateResourceUsage(state) {
        this.port.sendInternalMessage(7 /* updateResourceUsage */, state);
    }
    /**
     * 通知服务控制器出现错误,把错误发送给服务控制器
     *
     * @protected
     * @param {Error} err 错误消息
     *
     * @memberof RemoteService
     */
    sendError(err) {
        this.port.sendInternalMessage(4 /* remoteServiceError */, { message: err.message, stack: err.stack });
    }
    ;
    /**
     * 发送标准输出内容
     *
     * @protected
     * @param {string} out 标准输出的内容
     *
     * @memberof RemoteService
     */
    sendStdout(out) {
        this.port.sendInternalMessage(5 /* remoteStdout */, Date.now(), out);
    }
    /**
     * 发送标准错误输出的内容
     *
     * @protected
     * @param {string} out 标准错误输出
     *
     * @memberof RemoteService
     */
    sendStderr(out) {
        this.port.sendInternalMessage(6 /* remoteStderr */, Date.now(), out);
    }
    /**
     * 向控制器发送事件
     *
     * @protected
     * @param {string} eventName 事件名
     * @param {...any[]} args 参数
     *
     * @memberOf ServiceController
     */
    sendInternalMessage(eventName, ...args) {
        //不允许发送数字类型的事件名是为了避免与内部事件名相冲突
        this.port.sendInternalMessage(eventName, args);
    }
    get invokeTimeout() {
        return this.port.invokeTimeout;
    }
    set invokeTimeout(value) {
        if (value < 1)
            value = 1;
        this.port.invokeTimeout = value;
    }
    /**
     * 关闭服务
     * @memberof RemoteService
     */
    async closeService() {
        if (!this.hasClosed) {
            this.hasClosed = true;
            this.port.sendInternalMessage(3 /* runningStateChange */, 2 /* closing */); //通知正在关闭
            try {
                await this.onClose(); //调用关闭回调方法
            }
            catch (err) {
                this.port.sendInternalMessage(4 /* remoteServiceError */, { message: err.message, stack: err.stack });
            }
            this.port.sendInternalMessage(3 /* runningStateChange */, 3 /* closed */);
        }
    }
}
exports.default = RemoteService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LDBCQUFvQyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BILENBQUM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLDBCQUFvQyxFQUFFLGNBQW1CLENBQUMsQ0FBQztRQUM3RixDQUFDO0lBQ0wsQ0FBQztDQU9KO0FBRUQsa0JBQWUsYUFBYSxDQUFDIiwiZmlsZSI6IlJlbW90ZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL+eUqOS6juWkhOeQhuWvueW6lOaOp+WItuWZqOaIluWFtuS7lui/nOeoi+acjeWKoeWPkemAgei/h+adpeeahOivt+axguWSjOS6i+S7tuOAglxyXG5cclxuaW1wb3J0IENvbm5lY3Rpb25Qb3J0IGZyb20gJy4vQ29ubmVjdGlvblBvcnQvQ29ubmVjdGlvblBvcnQnO1xyXG5pbXBvcnQgUmVtb3RlU2VydmljZUNvbm5lY3Rpb25Qb3J0IGZyb20gJy4vQ29ubmVjdGlvblBvcnQvUmVtb3RlU2VydmljZUNvbm5lY3Rpb25Qb3J0JztcclxuaW1wb3J0IFJ1bm5pbmdTdGF0ZSBmcm9tICcuL1Rvb2xzL1J1bm5pbmdTdGF0ZSc7XHJcbmltcG9ydCBSZXNvdXJjZVVzYWdlSW5mb3JtYXRpb24gZnJvbSBcIi4vVG9vbHMvUmVzb3VyY2VVc2FnZUluZm9ybWF0aW9uXCI7XHJcbmltcG9ydCBJbnRlcm5hbEV2ZW50TmFtZSBmcm9tIFwiLi9Ub29scy9JbnRlcm5hbEV2ZW50TmFtZVwiO1xyXG5pbXBvcnQgU2ltcGxlRXZlbnRFbWl0ZXIgZnJvbSBcIi4vVG9vbHMvU2ltcGxlRXZlbnRFbWl0ZXJcIjtcclxuXHJcbmFic3RyYWN0IGNsYXNzIFJlbW90ZVNlcnZpY2Uge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcG9ydDogUmVtb3RlU2VydmljZUNvbm5lY3Rpb25Qb3J0O1xyXG4gICAgLy/mmK/lkKblt7Lnu4/lhbPpl63mnI3liqHkuoZcclxuICAgIHByaXZhdGUgaGFzQ2xvc2VkID0gZmFsc2U7XHJcblxyXG4gICAgLy/lhbPpl63mnI3liqHmnI3liqHlm57osINcclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBvbkNsb3NlKCk6IFByb21pc2U8dm9pZD47XHJcbiAgICAvL+aJp+ihjOacjeWKoeS7o+eggeWbnuiwg1xyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uRXhlY3V0ZUNvZGUoc2VydmljZUNvZGU6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XHJcbiAgICAvL+aOpeWPl+aOp+WItuWZqOWPkeadpeeahOWFtuS7luS6i+S7tlxyXG4gICAgcHJvdGVjdGVkIG9uSW50ZXJuYWxNZXNzYWdlOiAoZXZlbnROYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xyXG5cclxuICAgIC8v5a+85YWl55qE5pyN5YqhXHJcbiAgICBpbXBvcnRTZXJ2aWNlczogYW55ID0ge307XHJcbiAgICAvL+WvvOWHuueahOacjeWKoVxyXG4gICAgZXhwb3J0U2VydmljZXM6IGFueSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgaW1wb3J0U2VydmljZXM6IHN0cmluZ1tdLFxyXG4gICAgICAgIHBvcnQ6IENvbm5lY3Rpb25Qb3J0XHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnBvcnQgPSBuZXcgUmVtb3RlU2VydmljZUNvbm5lY3Rpb25Qb3J0KHNlcnZpY2VOYW1lLCBpbXBvcnRTZXJ2aWNlcywgcG9ydCk7XHJcblxyXG4gICAgICAgIC8v5piv5ZCm5bey57uP5omn6KGM5LqG5pyN5Yqh5Luj56CBXHJcbiAgICAgICAgbGV0IGhhc0V4ZWN1dGVTZXJ2aWNlQ29kZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL+e9kee7nOi/nuaOpeWHuueOsOmUmeivr+WwseWFs+mXreacjeWKoVxyXG4gICAgICAgIHRoaXMucG9ydC5vbkNvbm5lY3Rpb25FcnJvciA9ICgpID0+IHRoaXMub25DbG9zZSgpO1xyXG5cclxuICAgICAgICAvL+W9k+aOpeaUtuWIsOWGhemDqOa2iOaBr1xyXG4gICAgICAgIHRoaXMucG9ydC5vbkludGVybmFsTWVzc2FnZSA9IChldmVudE5hbWUsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgSW50ZXJuYWxFdmVudE5hbWUuY2xvc2U6IHsgLy/lhbPpl63lvZPliY3mnI3liqFcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBJbnRlcm5hbEV2ZW50TmFtZS5leGVjdXRlU2VydmljZUNvZGU6IHsgLy/miafooYzmjqfliLblmajlj5HmnaXnmoTmnI3liqHku6PnoIFcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc0V4ZWN1dGVTZXJ2aWNlQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNFeGVjdXRlU2VydmljZUNvZGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkV4ZWN1dGVDb2RlKGFyZ3NbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoSW50ZXJuYWxFdmVudE5hbWUucnVubmluZ1N0YXRlQ2hhbmdlLCBSdW5uaW5nU3RhdGUucnVubmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoSW50ZXJuYWxFdmVudE5hbWUucmVtb3RlU2VydmljZUVycm9yLCB7IG1lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGFjazogZXJyLnN0YWNrIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkludGVybmFsTWVzc2FnZSAmJiB0aGlzLm9uSW50ZXJuYWxNZXNzYWdlKGV2ZW50TmFtZS50b1N0cmluZygpLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8v5Yid5aeL5YyW5a+85YWl55qE5pyN5YqhXHJcbiAgICAgICAgdGhpcy5wb3J0LmltcG9ydFNlcnZpY2VzLmZvckVhY2goKHNlcnZpY2VOYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wb3J0U2VydmljZXNbc2VydmljZU5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgc2VydmljZXM6IG5ldyBQcm94eSh0aGlzLnBvcnQuc2VuZEludm9rZS5iaW5kKHRoaXMucG9ydCwgc2VydmljZU5hbWUpLCB7ICAgIC8v5ZCR5a+55bqU5pyN5Yqh5Y+R6YCB6K+35rGCXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0KHRhcmdldCwgZnVuY3Rpb25OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYmluZCh1bmRlZmluZWQsIGZ1bmN0aW9uTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBldmVudDogbmV3IFNpbXBsZUV2ZW50RW1pdGVyKCkgIC8v5o6l5Y+X5a+55bqU5pyN5Yqh55qE5LqL5Lu2XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v5b2T5o6l5pS25Yiw5L6d6LWW5pyN5Yqh5Y+R5p2l55qE5LqL5Lu2XHJcbiAgICAgICAgdGhpcy5wb3J0Lm9uRXZlbnRNZXNzYWdlID0gKHNlbmRlciwgZXZlbnROYW1lLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wb3J0U2VydmljZXNbc2VuZGVyXS5ldmVudC5lbWl0KGV2ZW50TmFtZSwgLi4uYXJncyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy/lpITnkIbov5znq6/mnI3liqHosIPnlKjor7fmsYJcclxuICAgICAgICB0aGlzLnBvcnQub25JbnZva2VNZXNzYWdlID0gYXN5bmMgKGZ1bmN0aW9uTmFtZSwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5leHBvcnRTZXJ2aWNlc1tmdW5jdGlvbk5hbWVdKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/lhazlvIDlj5HpgIHkuovku7bmlrnms5VcclxuICAgICAgICB0aGlzLnNlbmRFdmVudCA9IHRoaXMucG9ydC5zZW5kRXZlbnRNZXNzYWdlLmJpbmQodGhpcy5wb3J0KTtcclxuXHJcbiAgICAgICAgLy/pgJrnn6Xov5znq6/lt7Llh4blpIflpb3kuoZcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoSW50ZXJuYWxFdmVudE5hbWUucmVtb3RlUmVhZHkpO1xyXG4gICAgICAgIH0sIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAmuefpeacjeWKoeaOp+WItuWZqOi1hOa6kOa2iOiAl+aDheWGtVxyXG4gICAgICogXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKiBAcGFyYW0ge1Jlc291cmNlVXNhZ2VJbmZvcm1hdGlvbn0gc3RhdGUg5rqQ5raI6ICX5oOF5Ya1XHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJvZiBSZW1vdGVTZXJ2aWNlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBvblVwZGF0ZVJlc291cmNlVXNhZ2Uoc3RhdGU6IFJlc291cmNlVXNhZ2VJbmZvcm1hdGlvbikge1xyXG4gICAgICAgIHRoaXMucG9ydC5zZW5kSW50ZXJuYWxNZXNzYWdlKEludGVybmFsRXZlbnROYW1lLnVwZGF0ZVJlc291cmNlVXNhZ2UsIHN0YXRlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgJrnn6XmnI3liqHmjqfliLblmajlh7rnjrDplJnor68s5oqK6ZSZ6K+v5Y+R6YCB57uZ5pyN5Yqh5o6n5Yi25ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGVyciDplJnor6/mtojmga9cclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIFJlbW90ZVNlcnZpY2VcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHNlbmRFcnJvcihlcnI6IEVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoSW50ZXJuYWxFdmVudE5hbWUucmVtb3RlU2VydmljZUVycm9yLCB7IG1lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGFjazogZXJyLnN0YWNrIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPkemAgeagh+WHhui+k+WHuuWGheWuuVxyXG4gICAgICogXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3V0IOagh+WHhui+k+WHuueahOWGheWuuVxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVtb3RlU2VydmljZVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc2VuZFN0ZG91dChvdXQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucG9ydC5zZW5kSW50ZXJuYWxNZXNzYWdlKEludGVybmFsRXZlbnROYW1lLnJlbW90ZVN0ZG91dCwgRGF0ZS5ub3coKSwgb3V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPkemAgeagh+WHhumUmeivr+i+k+WHuueahOWGheWuuVxyXG4gICAgICogXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3V0IOagh+WHhumUmeivr+i+k+WHulxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVtb3RlU2VydmljZVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc2VuZFN0ZGVycihvdXQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucG9ydC5zZW5kSW50ZXJuYWxNZXNzYWdlKEludGVybmFsRXZlbnROYW1lLnJlbW90ZVN0ZGVyciwgRGF0ZS5ub3coKSwgb3V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWQkeaOp+WItuWZqOWPkemAgeS6i+S7tlxyXG4gICAgICogXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIOS6i+S7tuWQjVxyXG4gICAgICogQHBhcmFtIHsuLi5hbnlbXX0gYXJncyDlj4LmlbBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIFNlcnZpY2VDb250cm9sbGVyXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzZW5kSW50ZXJuYWxNZXNzYWdlKGV2ZW50TmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIC8v5LiN5YWB6K645Y+R6YCB5pWw5a2X57G75Z6L55qE5LqL5Lu25ZCN5piv5Li65LqG6YG/5YWN5LiO5YaF6YOo5LqL5Lu25ZCN55u45Yay56qBXHJcbiAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoZXZlbnROYW1lLCBhcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGludm9rZVRpbWVvdXQoKSB7IC8v6I635Y+W6LCD55So6LaF5pe2XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9ydC5pbnZva2VUaW1lb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXQgaW52b2tlVGltZW91dCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgMSkgdmFsdWUgPSAxO1xyXG4gICAgICAgIHRoaXMucG9ydC5pbnZva2VUaW1lb3V0ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbPpl63mnI3liqFcclxuICAgICAqIEBtZW1iZXJvZiBSZW1vdGVTZXJ2aWNlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGNsb3NlU2VydmljZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzQ2xvc2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFzQ2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoSW50ZXJuYWxFdmVudE5hbWUucnVubmluZ1N0YXRlQ2hhbmdlLCBSdW5uaW5nU3RhdGUuY2xvc2luZyk7IC8v6YCa55+l5q2j5Zyo5YWz6ZetXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLm9uQ2xvc2UoKTsgIC8v6LCD55So5YWz6Zet5Zue6LCD5pa55rOVXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3J0LnNlbmRJbnRlcm5hbE1lc3NhZ2UoSW50ZXJuYWxFdmVudE5hbWUucmVtb3RlU2VydmljZUVycm9yLCB7IG1lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGFjazogZXJyLnN0YWNrIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucG9ydC5zZW5kSW50ZXJuYWxNZXNzYWdlKEludGVybmFsRXZlbnROYW1lLnJ1bm5pbmdTdGF0ZUNoYW5nZSwgUnVubmluZ1N0YXRlLmNsb3NlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ZCR5YW25LuW5pyN5Yqh5Y+R6YCB5LqL5Lu2XHJcbiAgICAgKiBAbWVtYmVyb2YgUmVtb3RlU2VydmljZVxyXG4gICAgICovXHJcbiAgICBzZW5kRXZlbnQ6IChldmVudE5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlbW90ZVNlcnZpY2U7Il19
