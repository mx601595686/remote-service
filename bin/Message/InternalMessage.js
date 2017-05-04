/*内部消息，仅供ServiceController与RemoteService通信使用*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const Message_1 = require("./Message");
const ServiceController_1 = require("../ServiceController");
/*
    内部消息只发送给消息控制器
*/
class InternalMessage extends Message_1.default {
    /**
     * 创建一条内部消息
     * @param {boolean} isController 是否是控制器，通过这个来确定发送者与接受者的名称
     * @param {string} serviceName 控制器对应远程服务的名称
     * @param {(string | number)} eventName 要触发的事件名称
     * @param {*} data 要传递的数据
     *
     * @memberOf InternalMessage
     */
    constructor(isController, serviceName, eventName, args) {
        const sender = isController ? ServiceController_1.default.controllerName : serviceName;
        const receiver = isController ? serviceName : ServiceController_1.default.controllerName;
        super(receiver, sender, MessageType_1.default.internal, {
            eventName,
            args
        });
    }
}
exports.default = InternalMessage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lc3NhZ2UvSW50ZXJuYWxNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhDQUE4Qzs7O0FBRTlDLCtDQUF3QztBQUN4Qyx1Q0FBZ0M7QUFDaEMsNERBQXFEO0FBRXJEOztFQUVFO0FBRUYscUJBQXFDLFNBQVEsaUJBQU87SUFJaEQ7Ozs7Ozs7O09BUUc7SUFDSCxZQUFZLFlBQXFCLEVBQUUsV0FBbUIsRUFBRSxTQUEwQixFQUFFLElBQVc7UUFDM0YsTUFBTSxNQUFNLEdBQUcsWUFBWSxHQUFHLDJCQUFpQixDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUM7UUFDN0UsTUFBTSxRQUFRLEdBQUcsWUFBWSxHQUFHLFdBQVcsR0FBRywyQkFBaUIsQ0FBQyxjQUFjLENBQUM7UUFDL0UsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUscUJBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDMUMsU0FBUztZQUNULElBQUk7U0FDUCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFyQkQsa0NBcUJDIiwiZmlsZSI6Ik1lc3NhZ2UvSW50ZXJuYWxNZXNzYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyrlhoXpg6jmtojmga/vvIzku4XkvptTZXJ2aWNlQ29udHJvbGxlcuS4jlJlbW90ZVNlcnZpY2XpgJrkv6Hkvb/nlKgqL1xyXG5cclxuaW1wb3J0IE1lc3NhZ2VUeXBlIGZyb20gJy4vTWVzc2FnZVR5cGUnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlXCI7XHJcbmltcG9ydCBTZXJ2aWNlQ29udHJvbGxlciBmcm9tIFwiLi4vU2VydmljZUNvbnRyb2xsZXJcIjtcclxuXHJcbi8qXHJcbiAgICDlhoXpg6jmtojmga/lj6rlj5HpgIHnu5nmtojmga/mjqfliLblmahcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVybmFsTWVzc2FnZSBleHRlbmRzIE1lc3NhZ2Uge1xyXG5cclxuICAgIGRhdGE6IHsgZXZlbnROYW1lOiBzdHJpbmcgfCBudW1iZXIsIGFyZ3M6IGFueVtdIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rkuIDmnaHlhoXpg6jmtojmga9cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDb250cm9sbGVyIOaYr+WQpuaYr+aOp+WItuWZqO+8jOmAmui/h+i/meS4quadpeehruWumuWPkemAgeiAheS4juaOpeWPl+iAheeahOWQjeensFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VOYW1lIOaOp+WItuWZqOWvueW6lOi/nOeoi+acjeWKoeeahOWQjeensFxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nIHwgbnVtYmVyKX0gZXZlbnROYW1lIOimgeinpuWPkeeahOS6i+S7tuWQjeensFxyXG4gICAgICogQHBhcmFtIHsqfSBkYXRhIOimgeS8oOmAkueahOaVsOaNrlxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgSW50ZXJuYWxNZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGlzQ29udHJvbGxlcjogYm9vbGVhbiwgc2VydmljZU5hbWU6IHN0cmluZywgZXZlbnROYW1lOiBzdHJpbmcgfCBudW1iZXIsIGFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgY29uc3Qgc2VuZGVyID0gaXNDb250cm9sbGVyID8gU2VydmljZUNvbnRyb2xsZXIuY29udHJvbGxlck5hbWUgOiBzZXJ2aWNlTmFtZTtcclxuICAgICAgICBjb25zdCByZWNlaXZlciA9IGlzQ29udHJvbGxlciA/IHNlcnZpY2VOYW1lIDogU2VydmljZUNvbnRyb2xsZXIuY29udHJvbGxlck5hbWU7XHJcbiAgICAgICAgc3VwZXIocmVjZWl2ZXIsIHNlbmRlciwgTWVzc2FnZVR5cGUuaW50ZXJuYWwsIHtcclxuICAgICAgICAgICAgZXZlbnROYW1lLFxyXG4gICAgICAgICAgICBhcmdzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
