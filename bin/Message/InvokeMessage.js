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
        super([receiver], sender, MessageType_1.default.invoke, {
            callback: Math.random().toString(),
            functionName,
            args
        });
    }
}
exports.default = InvokeMessage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lc3NhZ2UvSW52b2tlTWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhOzs7QUFFYiwrQ0FBd0M7QUFDeEMsdUNBQWdDO0FBRWhDLG1CQUFtQyxTQUFRLGlCQUFPO0lBRzlDOzs7Ozs7OztPQVFHO0lBQ0gsWUFBWSxNQUFjLEVBQUUsUUFBZ0IsRUFBRSxZQUFvQixFQUFFLElBQVc7UUFDM0UsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLHFCQUFXLENBQUMsTUFBTSxFQUFFO1lBQzFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ2xDLFlBQVk7WUFDWixJQUFJO1NBQ1AsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBbkJELGdDQW1CQyIsImZpbGUiOiJNZXNzYWdlL0ludm9rZU1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL+iwg+eUqOi/nOeoi+acjeWKoeaWueazleeahOa2iOaBr1xyXG5cclxuaW1wb3J0IE1lc3NhZ2VUeXBlIGZyb20gJy4vTWVzc2FnZVR5cGUnO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZva2VNZXNzYWdlIGV4dGVuZHMgTWVzc2FnZSB7XHJcbiAgICBkYXRhOiB7IGNhbGxiYWNrOiBzdHJpbmcsIGZ1bmN0aW9uTmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65LiA5p2h6LCD55So5raI5oGvXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VuZGVyIOWPkemAgeacjeWKoeWQjeensFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlY2VpdmVyIOaOpeWPl+acjeWKoeWQjeensFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZSDosIPnlKjmlrnms5XlkI1cclxuICAgICAqIEBwYXJhbSB7Kn0gYXJncyDlj4LmlbBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIEludm9rZU1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Ioc2VuZGVyOiBzdHJpbmcsIHJlY2VpdmVyOiBzdHJpbmcsIGZ1bmN0aW9uTmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIHN1cGVyKFtyZWNlaXZlcl0sIHNlbmRlciwgTWVzc2FnZVR5cGUuaW52b2tlLCB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSxcclxuICAgICAgICAgICAgYXJnc1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il19
