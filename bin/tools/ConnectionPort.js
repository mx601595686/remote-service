/*
 * 抽象化一个与远端连接的通信端口。通过这个类隔开了内部代码与用户外部实现，用户可以通过任何方式来与服务建立连接,来进行消息的传递。
 * 通信端口提供者必须自行处理端口端口连接后应当采取的措施
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageData_1 = require("./MessageData");
const ServiceController_1 = require("../service/ServiceController");
class ConnectionPort {
    constructor(serviceName, importServices) {
        this.serviceName = serviceName;
        this.importServices = [ServiceController_1.ServiceController.controllerName, ...importServices];
    }
    //内部发送消息，在发送消息前会对发送的消息进行验证
    _sendMessage(message) {
        message.sender = this.serviceName;
        switch (message.type) {
            case MessageData_1.MessageType.invoke: {
                if (!this.importServices.includes(message.receiver)) {
                    this._onMessage(MessageData_1.default.prepareResponseInvoke(message, new Error(`The calling service '${message.receiver}' is not in the service list`)));
                }
                else {
                    this.onSendMessage(message);
                }
                break;
            }
            case MessageData_1.MessageType.response: {
                if (this.importServices.includes(message.receiver)) {
                    this.onSendMessage(message);
                }
                break;
            }
            default: {
                this.onSendMessage(message);
                break;
            }
        }
    }
    ;
    receiveMessage(message) {
        switch (message.type) {
            case MessageData_1.MessageType.invoke:
            case MessageData_1.MessageType.response: {
                if (message.receiver === this.serviceName) {
                    this._onMessage(message);
                }
                break;
            }
            default: {
                this._onMessage(message);
                break;
            }
        }
    }
}
exports.default = ConnectionPort;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzL0Nvbm5lY3Rpb25Qb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRzs7O0FBRUgsK0NBQXVEO0FBQ3ZELG9FQUErRDtBQUUvRDtJQU1JLFlBQVksV0FBbUIsRUFBRSxjQUF3QjtRQUNyRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMscUNBQWlCLENBQUMsY0FBYyxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELDBCQUEwQjtJQUMxQixZQUFZLENBQUMsT0FBb0I7UUFDN0IsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRWxDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEtBQUsseUJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFXLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUNyRCxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsT0FBTyxDQUFDLFFBQVEsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVGLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFDVixDQUFDO1lBQ0QsS0FBSyx5QkFBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUNELEtBQUssQ0FBQztZQUNWLENBQUM7WUFDRCxTQUFTLENBQUM7Z0JBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDNUIsS0FBSyxDQUFDO1lBQ1YsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVGLGNBQWMsQ0FBQyxPQUFvQjtRQUMvQixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuQixLQUFLLHlCQUFXLENBQUMsTUFBTSxDQUFDO1lBQ3hCLEtBQUsseUJBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFDVixDQUFDO1lBQ0QsU0FBUyxDQUFDO2dCQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pCLEtBQUssQ0FBQztZQUNWLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUdKO0FBRUQsa0JBQWUsY0FBYyxDQUFDIiwiZmlsZSI6InRvb2xzL0Nvbm5lY3Rpb25Qb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICog5oq96LGh5YyW5LiA5Liq5LiO6L+c56uv6L+e5o6l55qE6YCa5L+h56uv5Y+j44CC6YCa6L+H6L+Z5Liq57G76ZqU5byA5LqG5YaF6YOo5Luj56CB5LiO55So5oi35aSW6YOo5a6e546w77yM55So5oi35Y+v5Lul6YCa6L+H5Lu75L2V5pa55byP5p2l5LiO5pyN5Yqh5bu656uL6L+e5o6lLOadpei/m+ihjOa2iOaBr+eahOS8oOmAkuOAglxyXG4gKiDpgJrkv6Hnq6/lj6Pmj5DkvpvogIXlv4Xpobvoh6rooYzlpITnkIbnq6/lj6Pnq6/lj6Pov57mjqXlkI7lupTlvZPph4flj5bnmoTmjqrmlr1cclxuICovXHJcblxyXG5pbXBvcnQgTWVzc2FnZURhdGEsIHtNZXNzYWdlVHlwZX0gZnJvbSAnLi9NZXNzYWdlRGF0YSc7XHJcbmltcG9ydCB7U2VydmljZUNvbnRyb2xsZXJ9IGZyb20gJy4uL3NlcnZpY2UvU2VydmljZUNvbnRyb2xsZXInO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgQ29ubmVjdGlvblBvcnQge1xyXG5cclxuICAgIHNlcnZpY2VOYW1lOiBzdHJpbmc7IC8v5L2/55So6K+l5o6l5Y+j55qE5pyN5Yqh5ZCN56ewXHJcbiAgICBpbXBvcnRTZXJ2aWNlczogc3RyaW5nW107ICAgLy/or6XmnI3liqHlvJXnlKjnmoTlpJbpg6jmnI3liqHlkI1cclxuICAgIF9vbk1lc3NhZ2U6IChtZXNzYWdlOiBNZXNzYWdlRGF0YSkgPT4gdm9pZDsgICAgICAgICAvL+WGhemDqOeUqOS6juaOpeWPl+a2iOaBr+eahOWbnuiwg+aWueazlVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2VOYW1lOiBzdHJpbmcsIGltcG9ydFNlcnZpY2VzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZTtcclxuICAgICAgICB0aGlzLmltcG9ydFNlcnZpY2VzID0gW1NlcnZpY2VDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lLCAuLi5pbXBvcnRTZXJ2aWNlc107XHJcbiAgICB9XHJcblxyXG4gICAgLy/lhoXpg6jlj5HpgIHmtojmga/vvIzlnKjlj5HpgIHmtojmga/liY3kvJrlr7nlj5HpgIHnmoTmtojmga/ov5vooYzpqozor4FcclxuICAgIF9zZW5kTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlRGF0YSkge1xyXG4gICAgICAgIG1lc3NhZ2Uuc2VuZGVyID0gdGhpcy5zZXJ2aWNlTmFtZTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5pbnZva2U6IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbXBvcnRTZXJ2aWNlcy5pbmNsdWRlcyhtZXNzYWdlLnJlY2VpdmVyKSkgeyAgLy/lpoLmnpzor7fmsYLkuobkuI3lnKjmnI3liqHliJfooajkuK3nmoTmnI3liqFcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1lc3NhZ2UoTWVzc2FnZURhdGEucHJlcGFyZVJlc3BvbnNlSW52b2tlKG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihgVGhlIGNhbGxpbmcgc2VydmljZSAnJHttZXNzYWdlLnJlY2VpdmVyfScgaXMgbm90IGluIHRoZSBzZXJ2aWNlIGxpc3RgKSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VuZE1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLnJlc3BvbnNlOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbXBvcnRTZXJ2aWNlcy5pbmNsdWRlcyhtZXNzYWdlLnJlY2VpdmVyKSkgeyAgIC8v56Gu5L+d5Y+q5Zue5aSN5Zyo5pyN5Yqh5YiX6KGo5Lit55qE6K+35rGCXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJlY2VpdmVNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2VEYXRhKSB7XHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5pbnZva2U6XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUucmVzcG9uc2U6IHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLnJlY2VpdmVyID09PSB0aGlzLnNlcnZpY2VOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25NZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25NZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3Qgb25TZW5kTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlRGF0YSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbm5lY3Rpb25Qb3J0OyJdfQ==
