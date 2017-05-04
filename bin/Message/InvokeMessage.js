//调用远程服务方法的消息
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const Message_1 = require("./Message");
class InvokeMessage extends Message_1.default {
    /**
     * 创建一条调用消息
     * @param {string} sender 发送服务名称
     * @param {string} receiver 接受服务名称
     * @param {string} functionName 调用方法名
     * @param {*} args 参数
     *
     * @memberOf InvokeMessage
     */
    constructor(sender, receiver, functionName, args) {
        super(receiver, sender, MessageType_1.default.invoke, {
            callback: Math.random().toString(),
            functionName,
            args
        });
    }
}
exports.default = InvokeMessage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lc3NhZ2UvSW52b2tlTWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhOzs7QUFFYiwrQ0FBd0M7QUFDeEMsdUNBQWdDO0FBRWhDLG1CQUFtQyxTQUFRLGlCQUFPO0lBTzlDOzs7Ozs7OztPQVFHO0lBQ0gsWUFBWSxNQUFjLEVBQUUsUUFBZ0IsRUFBRSxZQUFvQixFQUFFLElBQVc7UUFDM0UsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUscUJBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDeEMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDbEMsWUFBWTtZQUNaLElBQUk7U0FDUCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUF2QkQsZ0NBdUJDIiwiZmlsZSI6Ik1lc3NhZ2UvSW52b2tlTWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8v6LCD55So6L+c56iL5pyN5Yqh5pa55rOV55qE5raI5oGvXHJcblxyXG5pbXBvcnQgTWVzc2FnZVR5cGUgZnJvbSAnLi9NZXNzYWdlVHlwZSc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludm9rZU1lc3NhZ2UgZXh0ZW5kcyBNZXNzYWdlIHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBjYWxsYmFjazogc3RyaW5nLCAgIC8v5Zue6LCDSURcclxuICAgICAgICBmdW5jdGlvbk5hbWU6IHN0cmluZywgLy/opoHosIPnlKjnmoTmlrnms5XlkI1cclxuICAgICAgICBhcmdzOiBhbnlbXSAvL+S8oOmAkueahOWPguaVsOaVsOe7hFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4gOadoeiwg+eUqOa2iOaBr1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbmRlciDlj5HpgIHmnI3liqHlkI3np7BcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWNlaXZlciDmjqXlj5fmnI3liqHlkI3np7BcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWUg6LCD55So5pa55rOV5ZCNXHJcbiAgICAgKiBAcGFyYW0geyp9IGFyZ3Mg5Y+C5pWwXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBJbnZva2VNZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHNlbmRlcjogc3RyaW5nLCByZWNlaXZlcjogc3RyaW5nLCBmdW5jdGlvbk5hbWU6IHN0cmluZywgYXJnczogYW55W10pIHtcclxuICAgICAgICBzdXBlcihyZWNlaXZlciwgc2VuZGVyLCBNZXNzYWdlVHlwZS5pbnZva2UsIHtcclxuICAgICAgICAgICAgY2FsbGJhY2s6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgZnVuY3Rpb25OYW1lLFxyXG4gICAgICAgICAgICBhcmdzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
