//服务控制器使用的连接端口。提供了对ConnectionPort的封装，方便使用
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InternalMessage_1 = require("../Message/InternalMessage");
const MessageType_1 = require("../Message/MessageType");
const ServiceController_1 = require("./../ServiceController");
class ServiceControllerConnectionPort {
    constructor(serviceName, //服务名称
        port //连接端口
    ) {
        this.serviceName = serviceName;
        this.port = port; //连接端口
        port.onError = (err) => this.onConnectionError && this.onConnectionError(err);
        port.onMessage = (message) => {
            //验证消息
            if (message.type === MessageType_1.default.internal)
                if (message.sender === this.serviceName)
                    if (message.receiver === ServiceController_1.default.controllerName) {
                        if (this.onInternalMessage !== undefined)
                            this.onInternalMessage(message.data.eventName, message.data.args);
                        return;
                    }
            console.error('Service controller has received a bad message: ', message);
        };
    }
    /**
     * 向远端服务发送内部事件消息
     *
     * @param {(string | number)} eventName 事件名称
     * @param {...any[]} args 参数
     *
     * @memberOf ServiceControllerConnectionPort
     */
    sendInternalMessage(eventName, ...args) {
        this.port.sendMessage(new InternalMessage_1.default(true, this.serviceName, eventName, args));
    }
}
exports.default = ServiceControllerConnectionPort;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbm5lY3Rpb25Qb3J0L1NlcnZpY2VDb250cm9sbGVyQ29ubmVjdGlvblBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEseUNBQXlDOzs7QUFHekMsZ0VBQXlEO0FBQ3pELHdEQUFpRDtBQUNqRCw4REFBdUQ7QUFFdkQ7SUFRSSxZQUNhLFdBQW1CLEVBQUksTUFBTTtRQUNyQixJQUFvQixDQUFHLE1BQU07O1FBRHJDLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ1gsU0FBSSxHQUFKLElBQUksQ0FBZ0IsQ0FBRyxNQUFNO1FBRTlDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFVLEtBQUssSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsT0FBd0I7WUFDdEMsTUFBTTtZQUNOLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUsscUJBQVcsQ0FBQyxRQUFRLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDcEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsS0FBSywyQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUN4RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEtBQUssU0FBUyxDQUFDOzRCQUNyQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDdEUsTUFBTSxDQUFDO29CQUNYLENBQUM7WUFFVCxPQUFPLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsbUJBQW1CLENBQUMsU0FBMEIsRUFBRSxHQUFHLElBQVc7UUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSx5QkFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7Q0FDSjtBQXRDRCxrREFzQ0MiLCJmaWxlIjoiQ29ubmVjdGlvblBvcnQvU2VydmljZUNvbnRyb2xsZXJDb25uZWN0aW9uUG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8v5pyN5Yqh5o6n5Yi25Zmo5L2/55So55qE6L+e5o6l56uv5Y+j44CC5o+Q5L6b5LqG5a+5Q29ubmVjdGlvblBvcnTnmoTlsIHoo4XvvIzmlrnkvr/kvb/nlKhcclxuXHJcbmltcG9ydCBDb25uZWN0aW9uUG9ydCBmcm9tICcuL0Nvbm5lY3Rpb25Qb3J0JztcclxuaW1wb3J0IEludGVybmFsTWVzc2FnZSBmcm9tIFwiLi4vTWVzc2FnZS9JbnRlcm5hbE1lc3NhZ2VcIjtcclxuaW1wb3J0IE1lc3NhZ2VUeXBlIGZyb20gXCIuLi9NZXNzYWdlL01lc3NhZ2VUeXBlXCI7XHJcbmltcG9ydCBTZXJ2aWNlQ29udHJvbGxlciBmcm9tICcuLy4uL1NlcnZpY2VDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyQ29ubmVjdGlvblBvcnQge1xyXG5cclxuICAgIC8v5YaF6YOo5rOo5YaM55qE5raI5oGv5o6l5pS25Zue6LCD5Ye95pWw44CCXHJcbiAgICBvbkludGVybmFsTWVzc2FnZTogKGV2ZW50TmFtZTogc3RyaW5nIHwgbnVtYmVyLCBhcmdzOiBhbnlbXSkgPT4gdm9pZDtcclxuXHJcbiAgICAvL+WGhemDqOazqOWGjOeahOe9kee7nOW8guW4uOWbnuiwg+WHveaVsOOAglxyXG4gICAgb25Db25uZWN0aW9uRXJyb3I6IChlcnI6IEVycm9yKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmcsICAgLy/mnI3liqHlkI3np7BcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHBvcnQ6IENvbm5lY3Rpb25Qb3J0ICAgLy/ov57mjqXnq6/lj6NcclxuICAgICkge1xyXG4gICAgICAgIHBvcnQub25FcnJvciA9IChlcnI6IEVycm9yKSA9PiB0aGlzLm9uQ29ubmVjdGlvbkVycm9yICYmIHRoaXMub25Db25uZWN0aW9uRXJyb3IoZXJyKTtcclxuICAgICAgICBwb3J0Lm9uTWVzc2FnZSA9IChtZXNzYWdlOiBJbnRlcm5hbE1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgICAgLy/pqozor4Hmtojmga9cclxuICAgICAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gTWVzc2FnZVR5cGUuaW50ZXJuYWwpXHJcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS5zZW5kZXIgPT09IHRoaXMuc2VydmljZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UucmVjZWl2ZXIgPT09IFNlcnZpY2VDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uSW50ZXJuYWxNZXNzYWdlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uSW50ZXJuYWxNZXNzYWdlKG1lc3NhZ2UuZGF0YS5ldmVudE5hbWUsIG1lc3NhZ2UuZGF0YS5hcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NlcnZpY2UgY29udHJvbGxlciBoYXMgcmVjZWl2ZWQgYSBiYWQgbWVzc2FnZTogJywgbWVzc2FnZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWQkei/nOerr+acjeWKoeWPkemAgeWGhemDqOS6i+S7tua2iOaBr1xyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0geyhzdHJpbmcgfCBudW1iZXIpfSBldmVudE5hbWUg5LqL5Lu25ZCN56ewXHJcbiAgICAgKiBAcGFyYW0gey4uLmFueVtdfSBhcmdzIOWPguaVsFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgU2VydmljZUNvbnRyb2xsZXJDb25uZWN0aW9uUG9ydFxyXG4gICAgICovXHJcbiAgICBzZW5kSW50ZXJuYWxNZXNzYWdlKGV2ZW50TmFtZTogc3RyaW5nIHwgbnVtYmVyLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucG9ydC5zZW5kTWVzc2FnZShuZXcgSW50ZXJuYWxNZXNzYWdlKHRydWUsIHRoaXMuc2VydmljZU5hbWUsIGV2ZW50TmFtZSwgYXJncykpO1xyXG4gICAgfVxyXG59Il19
