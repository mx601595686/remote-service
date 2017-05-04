//发送事件消息
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const Message_1 = require("./Message");
/*
事件消息是发送给所有依赖该服务的服务的，所以没有接收者
*/
class EventMessage extends Message_1.default {
    /**
     * 创建一条事件消息
     * @param {string} sender 发送服务名称
     * @param {(string | number)} eventName 触发事件名
     * @param {*} args 参数
     *
     * @memberOf EventMessage
     */
    constructor(sender, eventName, args) {
        super(undefined, sender, MessageType_1.default.event, {
            eventName,
            args
        });
    }
}
exports.default = EventMessage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lc3NhZ2UvRXZlbnRNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVE7OztBQUVSLCtDQUF3QztBQUN4Qyx1Q0FBZ0M7QUFFaEM7O0VBRUU7QUFFRixrQkFBa0MsU0FBUSxpQkFBTztJQU03Qzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxNQUFjLEVBQUUsU0FBMEIsRUFBRSxJQUFXO1FBQy9ELEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLHFCQUFXLENBQUMsS0FBSyxFQUFFO1lBQ3hDLFNBQVM7WUFDVCxJQUFJO1NBQ1AsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBcEJELCtCQW9CQyIsImZpbGUiOiJNZXNzYWdlL0V2ZW50TWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8v5Y+R6YCB5LqL5Lu25raI5oGvXHJcblxyXG5pbXBvcnQgTWVzc2FnZVR5cGUgZnJvbSAnLi9NZXNzYWdlVHlwZSc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VcIjtcclxuXHJcbi8qXHJcbuS6i+S7tua2iOaBr+aYr+WPkemAgee7meaJgOacieS+nei1luivpeacjeWKoeeahOacjeWKoeeahO+8jOaJgOS7peayoeacieaOpeaUtuiAhVxyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNZXNzYWdlIGV4dGVuZHMgTWVzc2FnZSB7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgZXZlbnROYW1lOiBzdHJpbmcgfCBudW1iZXIsIC8v6KaB6Kem5Y+R55qE5LqL5Lu25ZCN56ewXHJcbiAgICAgICAgYXJnczogYW55W10gLy/kvKDpgJLnmoTlj4LmlbDmlbDnu4RcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rkuIDmnaHkuovku7bmtojmga9cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZW5kZXIg5Y+R6YCB5pyN5Yqh5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0geyhzdHJpbmcgfCBudW1iZXIpfSBldmVudE5hbWUg6Kem5Y+R5LqL5Lu25ZCNXHJcbiAgICAgKiBAcGFyYW0geyp9IGFyZ3Mg5Y+C5pWwXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBFdmVudE1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Ioc2VuZGVyOiBzdHJpbmcsIGV2ZW50TmFtZTogc3RyaW5nIHwgbnVtYmVyLCBhcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIHN1cGVyKHVuZGVmaW5lZCwgc2VuZGVyLCBNZXNzYWdlVHlwZS5ldmVudCwge1xyXG4gICAgICAgICAgICBldmVudE5hbWUsXHJcbiAgICAgICAgICAgIGFyZ3NcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==
