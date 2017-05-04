//远程服务使用的连接端口。提供了对ConnectionPort的封装，方便使用
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InternalMessage_1 = require("../Message/InternalMessage");
const ResponseMessage_1 = require("../Message/ResponseMessage");
const InvokeMessage_1 = require("../Message/InvokeMessage");
const EventMessage_1 = require("../Message/EventMessage");
const MessageType_1 = require("../Message/MessageType");
const ServiceController_1 = require("./../ServiceController");
const RemoteInvokeError_1 = require("../Tools/RemoteInvokeError");
class RemoteServiceConnectionPort {
    constructor(serviceName, //服务名称
        importServices, //依赖的服务名称列表
        port //连接端口
    ) {
        this.serviceName = serviceName;
        this.importServices = importServices;
        this.port = port; //连接端口
        //回调列表(key是回调ID，value是回调方法)
        this.callbackList = new Map();
        //调用远程方法超时，默认一分钟
        this.invokeTimeout = 1000 * 60;
        port.onError = (err) => this.onConnectionError && this.onConnectionError(err);
        port.onMessage = (message) => {
            //验证消息
            if (message.receiver === this.serviceName) {
                switch (message.type) {
                    case MessageType_1.default.internal: {
                        if (message.sender === ServiceController_1.default.controllerName) {
                            if (this.onInternalMessage !== undefined)
                                this.onInternalMessage(message.data.eventName, message.data.args);
                            return;
                        }
                        break;
                    }
                    case MessageType_1.default.event: {
                        if (this.importServices.includes(message.sender)) {
                            if (this.onEventMessage !== undefined)
                                this.onEventMessage(message.sender, message.data.eventName, message.data.args);
                            return;
                        }
                        break;
                    }
                    case MessageType_1.default.invoke: {
                        //调用不用验证发送者
                        if (this.onInvokeMessage !== undefined)
                            this.onInvokeMessage(message.data.functionName, message.data.args)
                                .then((returnValue) => {
                                this.port.sendMessage(new ResponseMessage_1.default(message, this.serviceName, undefined, returnValue));
                            })
                                .catch((err) => {
                                this.port.sendMessage(new ResponseMessage_1.default(message, this.serviceName, err));
                            });
                        return;
                    }
                    case MessageType_1.default.response: {
                        if (this.importServices.includes(message.sender)) {
                            const callback = this.callbackList.get(message.data.callback);
                            if (callback !== undefined) {
                                const { error, returnData } = message.data;
                                error ? callback(new RemoteInvokeError_1.default(error)) : callback(undefined, returnData);
                            }
                            return;
                        }
                        break;
                    }
                }
            }
            console.error('Remote service has received a bad message: ', message);
        };
    }
    /**
     * 发送一条内部事件给服务控制器
     *
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     *
     * @memberOf RemoteServiceConnectionPort
     */
    sendInternalMessage(eventName, ...args) {
        this.port.sendMessage(new InternalMessage_1.default(false, this.serviceName, eventName, args));
    }
    /**
     * 发送事件消息给依赖了该服务的服务
     *
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     *
     * @memberOf RemoteServiceConnectionPort
     */
    sendEventMessage(eventName, ...args) {
        this.port.sendMessage(new EventMessage_1.default(this.serviceName, eventName, args));
    }
    /**
     * 向依赖的服务发送方法调用请求
     *
     * @param {string} receiver 依赖的服务名称
     * @param {string} functionName 要调用的方法名
     * @param {...any[]} args 参数
     * @returns {Promise<any>}
     *
     * @memberOf RemoteServiceConnectionPort
     */
    sendInvoke(receiver, functionName, ...args) {
        return new Promise((resolve, reject) => {
            if (this.importServices.includes(receiver)) {
                //创建消息
                const message = new InvokeMessage_1.default(this.serviceName, receiver, functionName, args);
                //回调标识
                const callbackID = message.data.callback;
                //创建回调函数
                const callback = (error, returnData) => {
                    clearTimeout(timeout); //关闭超时处理
                    this.callbackList.delete(callbackID); //在回调列表中清楚
                    error ? reject(error) : resolve(returnData);
                };
                //超时处理
                const timeout = setTimeout(() => {
                    callback(new Error(`invoke '${receiver}.${functionName}' timeout`));
                }, this.invokeTimeout);
                //添加到回调列表
                this.callbackList.set(callbackID, callback);
                //发送消息
                this.port.sendMessage(message);
            }
            else {
                reject(new Error(`invoking service '${receiver}' is not in importing services list`));
            }
        });
    }
}
exports.default = RemoteServiceConnectionPort;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbm5lY3Rpb25Qb3J0L1JlbW90ZVNlcnZpY2VDb25uZWN0aW9uUG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3Q0FBd0M7OztBQUl4QyxnRUFBeUQ7QUFDekQsZ0VBQXlEO0FBQ3pELDREQUFxRDtBQUNyRCwwREFBbUQ7QUFDbkQsd0RBQWlEO0FBQ2pELDhEQUF1RDtBQUN2RCxrRUFBMkQ7QUFHM0Q7SUFnQkksWUFDYSxXQUFtQixFQUFJLE1BQU07UUFDN0IsY0FBd0IsRUFBRyxXQUFXO1FBQzlCLElBQW9CLENBQUcsTUFBTTs7UUFGckMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDbkIsbUJBQWMsR0FBZCxjQUFjLENBQVU7UUFDaEIsU0FBSSxHQUFKLElBQUksQ0FBZ0IsQ0FBRyxNQUFNO1FBakJsRCwyQkFBMkI7UUFDbkIsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBb0QsQ0FBQztRQUNuRixnQkFBZ0I7UUFDaEIsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBZ0J0QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBVSxLQUFLLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLE9BQWdCO1lBQzlCLE1BQU07WUFFTixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxxQkFBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLDJCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7NEJBQ3RELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLENBQUM7Z0NBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FDQSxPQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFDdkIsT0FBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDOUMsTUFBTSxDQUFDO3dCQUNYLENBQUM7d0JBQ0QsS0FBSyxDQUFDO29CQUNWLENBQUM7b0JBQ0QsS0FBSyxxQkFBVyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsQ0FBQztnQ0FDbEMsSUFBSSxDQUFDLGNBQWMsQ0FDZixPQUFPLENBQUMsTUFBTSxFQUNDLE9BQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUN2QixPQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUMzQyxNQUFNLENBQUM7d0JBQ1gsQ0FBQzt3QkFDRCxLQUFLLENBQUM7b0JBQ1YsQ0FBQztvQkFDRCxLQUFLLHFCQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7d0JBQ3RCLFdBQVc7d0JBQ1gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLENBQUM7NEJBQ25DLElBQUksQ0FBQyxlQUFlLENBQ0EsT0FBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQzFCLE9BQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2lDQUdsQyxJQUFJLENBQUMsQ0FBQyxXQUFnQjtnQ0FDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSx5QkFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUNsRyxDQUFDLENBQUM7aUNBQ0QsS0FBSyxDQUFDLENBQUMsR0FBVTtnQ0FDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLHlCQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDL0UsQ0FBQyxDQUFDLENBQUM7d0JBQ1gsTUFBTSxDQUFDO29CQUNYLENBQUM7b0JBQ0QsS0FBSyxxQkFBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBbUIsT0FBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDakYsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3pCLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEdBQXFCLE9BQVEsQ0FBQyxJQUFJLENBQUM7Z0NBQzlELEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSwyQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7NEJBQ3JGLENBQUM7NEJBQ0QsTUFBTSxDQUFDO3dCQUNYLENBQUM7d0JBQ0QsS0FBSyxDQUFDO29CQUNWLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxPQUFPLENBQUMsS0FBSyxDQUFDLDZDQUE2QyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsbUJBQW1CLENBQUMsU0FBMEIsRUFBRSxHQUFHLElBQVc7UUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSx5QkFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsZ0JBQWdCLENBQUMsU0FBMEIsRUFBRSxHQUFHLElBQVc7UUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxzQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILFVBQVUsQ0FBQyxRQUFnQixFQUFFLFlBQW9CLEVBQUUsR0FBRyxJQUFXO1FBQzdELE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsTUFBTTtnQkFDTixNQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUVsRixNQUFNO2dCQUNOLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUV6QyxRQUFRO2dCQUNSLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBWSxFQUFFLFVBQWdCO29CQUM1QyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxRQUFRO29CQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFHLFVBQVU7b0JBQ2xELEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDLENBQUE7Z0JBRUQsTUFBTTtnQkFDTixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUM7b0JBQ3ZCLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxXQUFXLFFBQVEsSUFBSSxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRXZCLFNBQVM7Z0JBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU1QyxNQUFNO2dCQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMscUJBQXFCLFFBQVEscUNBQXFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQW5KRCw4Q0FtSkMiLCJmaWxlIjoiQ29ubmVjdGlvblBvcnQvUmVtb3RlU2VydmljZUNvbm5lY3Rpb25Qb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy/ov5znqIvmnI3liqHkvb/nlKjnmoTov57mjqXnq6/lj6PjgILmj5Dkvpvkuoblr7lDb25uZWN0aW9uUG9ydOeahOWwgeijhe+8jOaWueS+v+S9v+eUqFxyXG5cclxuaW1wb3J0IENvbm5lY3Rpb25Qb3J0IGZyb20gJy4vQ29ubmVjdGlvblBvcnQnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiLi4vTWVzc2FnZS9NZXNzYWdlXCI7XHJcbmltcG9ydCBJbnRlcm5hbE1lc3NhZ2UgZnJvbSBcIi4uL01lc3NhZ2UvSW50ZXJuYWxNZXNzYWdlXCI7XHJcbmltcG9ydCBSZXNwb25zZU1lc3NhZ2UgZnJvbSBcIi4uL01lc3NhZ2UvUmVzcG9uc2VNZXNzYWdlXCI7XHJcbmltcG9ydCBJbnZva2VNZXNzYWdlIGZyb20gXCIuLi9NZXNzYWdlL0ludm9rZU1lc3NhZ2VcIjtcclxuaW1wb3J0IEV2ZW50TWVzc2FnZSBmcm9tIFwiLi4vTWVzc2FnZS9FdmVudE1lc3NhZ2VcIjtcclxuaW1wb3J0IE1lc3NhZ2VUeXBlIGZyb20gXCIuLi9NZXNzYWdlL01lc3NhZ2VUeXBlXCI7XHJcbmltcG9ydCBTZXJ2aWNlQ29udHJvbGxlciBmcm9tICcuLy4uL1NlcnZpY2VDb250cm9sbGVyJztcclxuaW1wb3J0IFJlbW90ZUludm9rZUVycm9yIGZyb20gXCIuLi9Ub29scy9SZW1vdGVJbnZva2VFcnJvclwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZVNlcnZpY2VDb25uZWN0aW9uUG9ydCB7XHJcblxyXG4gICAgLy/lm57osIPliJfooagoa2V55piv5Zue6LCDSUTvvIx2YWx1ZeaYr+Wbnuiwg+aWueazlSlcclxuICAgIHByaXZhdGUgY2FsbGJhY2tMaXN0ID0gbmV3IE1hcDxzdHJpbmcsIChlcnJvcjogRXJyb3IsIHJldHVybkRhdGE/OiBhbnkpID0+IHZvaWQ+KCk7XHJcbiAgICAvL+iwg+eUqOi/nOeoi+aWueazlei2heaXtu+8jOm7mOiupOS4gOWIhumSn1xyXG4gICAgaW52b2tlVGltZW91dCA9IDEwMDAgKiA2MDtcclxuXHJcbiAgICAvL+WGhemDqOaOpeaUtuaOp+WItuWZqOWPkeadpeeahOS6i+S7tua2iOaBr+eahOWbnuiwg+WHveaVsOOAglxyXG4gICAgb25JbnRlcm5hbE1lc3NhZ2U6IChldmVudE5hbWU6IHN0cmluZyB8IG51bWJlciwgYXJnczogYW55W10pID0+IHZvaWQ7XHJcbiAgICAvL+WGhemDqOaOpeaUtuS6i+S7tua2iOaBr+eahOWbnuiwg+WHveaVsOOAglxyXG4gICAgb25FdmVudE1lc3NhZ2U6IChzZW5kZXI6IHN0cmluZywgZXZlbnROYW1lOiBzdHJpbmcgfCBudW1iZXIsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xyXG4gICAgLy/lhoXpg6jmjqXmlLbosIPnlKjor7fmsYLnmoTlm57osIPlh73mlbDjgIJcclxuICAgIG9uSW52b2tlTWVzc2FnZTogKGZ1bmN0aW9uTmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+O1xyXG4gICAgLy/lhoXpg6jms6jlhoznmoTnvZHnu5zlvILluLjlm57osIPlh73mlbDjgIJcclxuICAgIG9uQ29ubmVjdGlvbkVycm9yOiAoZXJyOiBFcnJvcikgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nLCAgIC8v5pyN5Yqh5ZCN56ewXHJcbiAgICAgICAgcmVhZG9ubHkgaW1wb3J0U2VydmljZXM6IHN0cmluZ1tdLCAgLy/kvp3otZbnmoTmnI3liqHlkI3np7DliJfooahcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHBvcnQ6IENvbm5lY3Rpb25Qb3J0ICAgLy/ov57mjqXnq6/lj6NcclxuICAgICkge1xyXG4gICAgICAgIHBvcnQub25FcnJvciA9IChlcnI6IEVycm9yKSA9PiB0aGlzLm9uQ29ubmVjdGlvbkVycm9yICYmIHRoaXMub25Db25uZWN0aW9uRXJyb3IoZXJyKTtcclxuICAgICAgICBwb3J0Lm9uTWVzc2FnZSA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICAgIC8v6aqM6K+B5raI5oGvXHJcblxyXG4gICAgICAgICAgICBpZiAobWVzc2FnZS5yZWNlaXZlciA9PT0gdGhpcy5zZXJ2aWNlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLmludGVybmFsOiB7ICAgIC8v5aaC5p6c5piv5YaF6YOo5LqL5Lu25raI5oGvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLnNlbmRlciA9PT0gU2VydmljZUNvbnRyb2xsZXIuY29udHJvbGxlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uSW50ZXJuYWxNZXNzYWdlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkludGVybmFsTWVzc2FnZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDxJbnRlcm5hbE1lc3NhZ2U+bWVzc2FnZSkuZGF0YS5ldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg8SW50ZXJuYWxNZXNzYWdlPm1lc3NhZ2UpLmRhdGEuYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuZXZlbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW1wb3J0U2VydmljZXMuaW5jbHVkZXMobWVzc2FnZS5zZW5kZXIpKSB7IC8v56Gu5L+d5Y+q5pS25Yiw6K+l5pyN5Yqh5L6d6LWW55qE5pyN5Yqh5Y+R5p2l55qE5LqL5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vbkV2ZW50TWVzc2FnZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25FdmVudE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2Uuc2VuZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPEV2ZW50TWVzc2FnZT5tZXNzYWdlKS5kYXRhLmV2ZW50TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDxFdmVudE1lc3NhZ2U+bWVzc2FnZSkuZGF0YS5hcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5pbnZva2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/osIPnlKjkuI3nlKjpqozor4Hlj5HpgIHogIVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub25JbnZva2VNZXNzYWdlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uSW52b2tlTWVzc2FnZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPEludm9rZU1lc3NhZ2U+bWVzc2FnZSkuZGF0YS5mdW5jdGlvbk5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDxJbnZva2VNZXNzYWdlPm1lc3NhZ2UpLmRhdGEuYXJncylcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lm57lpI3osIPnlKjor7fmsYJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmV0dXJuVmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcnQuc2VuZE1lc3NhZ2UobmV3IFJlc3BvbnNlTWVzc2FnZShtZXNzYWdlLCB0aGlzLnNlcnZpY2VOYW1lLCB1bmRlZmluZWQsIHJldHVyblZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3J0LnNlbmRNZXNzYWdlKG5ldyBSZXNwb25zZU1lc3NhZ2UobWVzc2FnZSwgdGhpcy5zZXJ2aWNlTmFtZSwgZXJyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5yZXNwb25zZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbXBvcnRTZXJ2aWNlcy5pbmNsdWRlcyhtZXNzYWdlLnNlbmRlcikpIHsgLy/noa7kv53lj6rmlLbliLDor6XmnI3liqHkvp3otZbnmoTmnI3liqHlj5HmnaXnmoTlm57lpI1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5jYWxsYmFja0xpc3QuZ2V0KCg8UmVzcG9uc2VNZXNzYWdlPm1lc3NhZ2UpLmRhdGEuY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yLCByZXR1cm5EYXRhIH0gPSAoPFJlc3BvbnNlTWVzc2FnZT5tZXNzYWdlKS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID8gY2FsbGJhY2sobmV3IFJlbW90ZUludm9rZUVycm9yKGVycm9yKSkgOiBjYWxsYmFjayh1bmRlZmluZWQsIHJldHVybkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUmVtb3RlIHNlcnZpY2UgaGFzIHJlY2VpdmVkIGEgYmFkIG1lc3NhZ2U6ICcsIG1lc3NhZ2UpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHkuIDmnaHlhoXpg6jkuovku7bnu5nmnI3liqHmjqfliLblmahcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nIHwgbnVtYmVyKX0gZXZlbnROYW1lIOS6i+S7tuWQjeensFxyXG4gICAgICogQHBhcmFtIHsuLi5hbnlbXX0gYXJncyDlj4LmlbBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIFJlbW90ZVNlcnZpY2VDb25uZWN0aW9uUG9ydFxyXG4gICAgICovXHJcbiAgICBzZW5kSW50ZXJuYWxNZXNzYWdlKGV2ZW50TmFtZTogc3RyaW5nIHwgbnVtYmVyLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIHRoaXMucG9ydC5zZW5kTWVzc2FnZShuZXcgSW50ZXJuYWxNZXNzYWdlKGZhbHNlLCB0aGlzLnNlcnZpY2VOYW1lLCBldmVudE5hbWUsIGFyZ3MpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPkemAgeS6i+S7tua2iOaBr+e7meS+nei1luS6huivpeacjeWKoeeahOacjeWKoVxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0geyhzdHJpbmcgfCBudW1iZXIpfSBldmVudE5hbWUg5LqL5Lu25ZCN56ewXHJcbiAgICAgKiBAcGFyYW0gey4uLmFueVtdfSBhcmdzIOWPguaVsFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgUmVtb3RlU2VydmljZUNvbm5lY3Rpb25Qb3J0XHJcbiAgICAgKi9cclxuICAgIHNlbmRFdmVudE1lc3NhZ2UoZXZlbnROYW1lOiBzdHJpbmcgfCBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgdGhpcy5wb3J0LnNlbmRNZXNzYWdlKG5ldyBFdmVudE1lc3NhZ2UodGhpcy5zZXJ2aWNlTmFtZSwgZXZlbnROYW1lLCBhcmdzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlkJHkvp3otZbnmoTmnI3liqHlj5HpgIHmlrnms5XosIPnlKjor7fmsYJcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlY2VpdmVyIOS+nei1lueahOacjeWKoeWQjeensFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZSDopoHosIPnlKjnmoTmlrnms5XlkI1cclxuICAgICAqIEBwYXJhbSB7Li4uYW55W119IGFyZ3Mg5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIFJlbW90ZVNlcnZpY2VDb25uZWN0aW9uUG9ydFxyXG4gICAgICovXHJcbiAgICBzZW5kSW52b2tlKHJlY2VpdmVyOiBzdHJpbmcsIGZ1bmN0aW9uTmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW1wb3J0U2VydmljZXMuaW5jbHVkZXMocmVjZWl2ZXIpKSB7ICAgLy/liKTmlq3osIPnlKjnmoTmnI3liqHlnKjkuI3lnKjkvp3otZbmnI3liqHliJfooajkuK1cclxuICAgICAgICAgICAgICAgIC8v5Yib5bu65raI5oGvXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IEludm9rZU1lc3NhZ2UodGhpcy5zZXJ2aWNlTmFtZSwgcmVjZWl2ZXIsIGZ1bmN0aW9uTmFtZSwgYXJncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/lm57osIPmoIfor4ZcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrSUQgPSBtZXNzYWdlLmRhdGEuY2FsbGJhY2s7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/liJvlu7rlm57osIPlh73mlbBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGVycm9yOiBFcnJvciwgcmV0dXJuRGF0YT86IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTsgIC8v5YWz6Zet6LaF5pe25aSE55CGXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja0xpc3QuZGVsZXRlKGNhbGxiYWNrSUQpOyAgIC8v5Zyo5Zue6LCD5YiX6KGo5Lit5riF5qWaXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoZXJyb3IpIDogcmVzb2x2ZShyZXR1cm5EYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL+i2heaXtuWkhOeQhlxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihgaW52b2tlICcke3JlY2VpdmVyfS4ke2Z1bmN0aW9uTmFtZX0nIHRpbWVvdXRgKSk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmludm9rZVRpbWVvdXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5re75Yqg5Yiw5Zue6LCD5YiX6KGoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrTGlzdC5zZXQoY2FsbGJhY2tJRCwgY2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5Y+R6YCB5raI5oGvXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcnQuc2VuZE1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBpbnZva2luZyBzZXJ2aWNlICcke3JlY2VpdmVyfScgaXMgbm90IGluIGltcG9ydGluZyBzZXJ2aWNlcyBsaXN0YCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
