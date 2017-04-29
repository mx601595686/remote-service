/*内部消息，仅供ServiceController与RemoteService通信使用*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const Message_1 = require("./Message");
const ServiceController_1 = require("../ServiceController");
class InternalMessage extends Message_1.default {
    /**
     * 创建一条内部消息
     * @param {boolean} isController 是否是控制器，通过这个来确定发送者与接受者的名称
     * @param {string} serviceName 控制器对应远程服务的名称
     * @param {string} eventName 要触发的事件名称
     * @param {*} data 要传递的数据
     *
     * @memberOf InternalMessage
     */
    constructor(isController, serviceName, eventName, args) {
        const sender = isController ? ServiceController_1.default.controllerName : serviceName;
        const receiver = isController ? serviceName : ServiceController_1.default.controllerName;
        super([receiver], sender, MessageType_1.default.internal, {
            eventName,
            args
        });
    }
}
exports.default = InternalMessage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lc3NhZ2UvSW50ZXJuYWxNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhDQUE4Qzs7O0FBRTlDLCtDQUF3QztBQUN4Qyx1Q0FBZ0M7QUFDaEMsNERBQXFEO0FBRXJELHFCQUFxQyxTQUFRLGlCQUFPO0lBSWhEOzs7Ozs7OztPQVFHO0lBQ0gsWUFBWSxZQUFxQixFQUFFLFdBQW1CLEVBQUUsU0FBaUIsRUFBRSxJQUFXO1FBQ2xGLE1BQU0sTUFBTSxHQUFHLFlBQVksR0FBRywyQkFBaUIsQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDO1FBQzdFLE1BQU0sUUFBUSxHQUFHLFlBQVksR0FBRyxXQUFXLEdBQUcsMkJBQWlCLENBQUMsY0FBYyxDQUFDO1FBQy9FLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxxQkFBVyxDQUFDLFFBQVEsRUFBRTtZQUM1QyxTQUFTO1lBQ1QsSUFBSTtTQUNQLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXJCRCxrQ0FxQkMiLCJmaWxlIjoiTWVzc2FnZS9JbnRlcm5hbE1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKuWGhemDqOa2iOaBr++8jOS7heS+m1NlcnZpY2VDb250cm9sbGVy5LiOUmVtb3RlU2VydmljZemAmuS/oeS9v+eUqCovXHJcblxyXG5pbXBvcnQgTWVzc2FnZVR5cGUgZnJvbSAnLi9NZXNzYWdlVHlwZSc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VcIjtcclxuaW1wb3J0IFNlcnZpY2VDb250cm9sbGVyIGZyb20gXCIuLi9TZXJ2aWNlQ29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJuYWxNZXNzYWdlIGV4dGVuZHMgTWVzc2FnZSB7XHJcblxyXG4gICAgZGF0YTogeyBldmVudE5hbWU6IHN0cmluZywgYXJnczogYW55W10gfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4gOadoeWGhemDqOa2iOaBr1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc0NvbnRyb2xsZXIg5piv5ZCm5piv5o6n5Yi25Zmo77yM6YCa6L+H6L+Z5Liq5p2l56Gu5a6a5Y+R6YCB6ICF5LiO5o6l5Y+X6ICF55qE5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VydmljZU5hbWUg5o6n5Yi25Zmo5a+55bqU6L+c56iL5pyN5Yqh55qE5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIOimgeinpuWPkeeahOS6i+S7tuWQjeensFxyXG4gICAgICogQHBhcmFtIHsqfSBkYXRhIOimgeS8oOmAkueahOaVsOaNrlxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgSW50ZXJuYWxNZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGlzQ29udHJvbGxlcjogYm9vbGVhbiwgc2VydmljZU5hbWU6IHN0cmluZywgZXZlbnROYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgY29uc3Qgc2VuZGVyID0gaXNDb250cm9sbGVyID8gU2VydmljZUNvbnRyb2xsZXIuY29udHJvbGxlck5hbWUgOiBzZXJ2aWNlTmFtZTtcclxuICAgICAgICBjb25zdCByZWNlaXZlciA9IGlzQ29udHJvbGxlciA/IHNlcnZpY2VOYW1lIDogU2VydmljZUNvbnRyb2xsZXIuY29udHJvbGxlck5hbWU7XHJcbiAgICAgICAgc3VwZXIoW3JlY2VpdmVyXSwgc2VuZGVyLCBNZXNzYWdlVHlwZS5pbnRlcm5hbCwge1xyXG4gICAgICAgICAgICBldmVudE5hbWUsXHJcbiAgICAgICAgICAgIGFyZ3NcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==
