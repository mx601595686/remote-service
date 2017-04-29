//响应远端服务请求
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const Message_1 = require("./Message");
class ResponseMessage extends Message_1.default {
    /**
     * 创建一条回复调用消息
     * @param {InvokeMessage} invokeMessage 调用消息
     * @param {string} sender 发送者名称
     * @param {Error} err 错误信息
     * @param {*} [returnData] 返回数据
     *
     * @memberOf ResponseMessage
     */
    constructor(invokeMessage, sender, err, returnData) {
        super([invokeMessage.sender], sender, MessageType_1.default.response, {
            callback: invokeMessage.data.callback,
            err: { message: err.message, stack: err.stack },
            returnData
        });
    }
}
exports.default = ResponseMessage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lc3NhZ2UvUmVzcG9uc2VNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQVU7OztBQUVWLCtDQUF3QztBQUN4Qyx1Q0FBZ0M7QUFJaEMscUJBQXFDLFNBQVEsaUJBQU87SUFHaEQ7Ozs7Ozs7O09BUUc7SUFDSCxZQUFZLGFBQTRCLEVBQUUsTUFBYyxFQUFFLEdBQVUsRUFBRSxVQUFnQjtRQUNsRixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLHFCQUFXLENBQUMsUUFBUSxFQUFFO1lBQ3hELFFBQVEsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVE7WUFDckMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDL0MsVUFBVTtTQUNiLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQW5CRCxrQ0FtQkMiLCJmaWxlIjoiTWVzc2FnZS9SZXNwb25zZU1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL+WTjeW6lOi/nOerr+acjeWKoeivt+axglxyXG5cclxuaW1wb3J0IE1lc3NhZ2VUeXBlIGZyb20gJy4vTWVzc2FnZVR5cGUnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlXCI7XHJcbmltcG9ydCBJbnZva2VNZXNzYWdlIGZyb20gXCIuL0ludm9rZU1lc3NhZ2VcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNwb25zZU1lc3NhZ2UgZXh0ZW5kcyBNZXNzYWdlIHtcclxuICAgIGRhdGE6IHsgY2FsbGJhY2s6IHN0cmluZywgZXJyOiB7IG1lc3NhZ2U6IHN0cmluZywgc3RhY2s6IHN0cmluZyB9LCByZXR1cm5EYXRhOiBhbnkgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4gOadoeWbnuWkjeiwg+eUqOa2iOaBr1xyXG4gICAgICogQHBhcmFtIHtJbnZva2VNZXNzYWdlfSBpbnZva2VNZXNzYWdlIOiwg+eUqOa2iOaBr1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbmRlciDlj5HpgIHogIXlkI3np7BcclxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGVyciDplJnor6/kv6Hmga9cclxuICAgICAqIEBwYXJhbSB7Kn0gW3JldHVybkRhdGFdIOi/lOWbnuaVsOaNriBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIFJlc3BvbnNlTWVzc2FnZVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihpbnZva2VNZXNzYWdlOiBJbnZva2VNZXNzYWdlLCBzZW5kZXI6IHN0cmluZywgZXJyOiBFcnJvciwgcmV0dXJuRGF0YT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyKFtpbnZva2VNZXNzYWdlLnNlbmRlcl0sIHNlbmRlciwgTWVzc2FnZVR5cGUucmVzcG9uc2UsIHtcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGludm9rZU1lc3NhZ2UuZGF0YS5jYWxsYmFjayxcclxuICAgICAgICAgICAgZXJyOiB7IG1lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGFjazogZXJyLnN0YWNrIH0sXHJcbiAgICAgICAgICAgIHJldHVybkRhdGFcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==
