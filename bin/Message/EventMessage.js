//发送事件消息
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const Message_1 = require("./Message");
class EventMessage extends Message_1.default {
    /**
     * 创建一条事件消息
     * @param {string} sender 发送服务名称
     * @param {string[]} receiver 接受服务名称
     * @param {string} eventName 触发事件名
     * @param {*} args 参数
     *
     * @memberOf EventMessage
     */
    constructor(sender, receiver, eventName, args) {
        super(receiver, sender, MessageType_1.default.event, {
            eventName,
            args
        });
    }
}
exports.default = EventMessage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lc3NhZ2UvRXZlbnRNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVE7OztBQUVSLCtDQUF3QztBQUN4Qyx1Q0FBZ0M7QUFFaEMsa0JBQWtDLFNBQVEsaUJBQU87SUFHN0M7Ozs7Ozs7O09BUUc7SUFDSCxZQUFZLE1BQWMsRUFBRSxRQUFrQixFQUFFLFNBQWlCLEVBQUUsSUFBVztRQUMxRSxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxTQUFTO1lBQ1QsSUFBSTtTQUNQLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQWxCRCwrQkFrQkMiLCJmaWxlIjoiTWVzc2FnZS9FdmVudE1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL+WPkemAgeS6i+S7tua2iOaBr1xyXG5cclxuaW1wb3J0IE1lc3NhZ2VUeXBlIGZyb20gJy4vTWVzc2FnZVR5cGUnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudE1lc3NhZ2UgZXh0ZW5kcyBNZXNzYWdlIHtcclxuICAgIGRhdGE6IHsgZXZlbnROYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rkuIDmnaHkuovku7bmtojmga9cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZW5kZXIg5Y+R6YCB5pyN5Yqh5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSByZWNlaXZlciDmjqXlj5fmnI3liqHlkI3np7BcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUg6Kem5Y+R5LqL5Lu25ZCNXHJcbiAgICAgKiBAcGFyYW0geyp9IGFyZ3Mg5Y+C5pWwXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBFdmVudE1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Ioc2VuZGVyOiBzdHJpbmcsIHJlY2VpdmVyOiBzdHJpbmdbXSwgZXZlbnROYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgc3VwZXIocmVjZWl2ZXIsIHNlbmRlciwgTWVzc2FnZVR5cGUuZXZlbnQsIHtcclxuICAgICAgICAgICAgZXZlbnROYW1lLFxyXG4gICAgICAgICAgICBhcmdzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
