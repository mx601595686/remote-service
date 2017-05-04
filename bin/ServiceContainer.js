//服务容器
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleEventEmiter_1 = require("./Tools/SimpleEventEmiter");
/*
包含的事件
    //服务发生错误
    error: (err: Error) => void;
    //远端发来的标准输出
    stdout: (out: { type: number, timestamp: number, content: string }) => void;
    //远端服务运行状态发生改变
    runningStateChange: (state: RunningState) => void;
    //更新远端资源消耗情况
    updateResourceUsage: (usage: ResourceUsageInformation) => void;
*/
class ServiceContainer extends SimpleEventEmiter_1.default {
    constructor(serviceName, //服务名称
        serviceCode, //服务代码
        importServices, //服务依赖的其他服务
        config //配置服务容器的参数
    ) {
        super();
        this.serviceName = serviceName;
        this.serviceCode = serviceCode;
        this.importServices = importServices;
        //服务运行状态
        this.runningState = 3 /* closed */;
        //服务运行错误
        this.errors = [];
        //服务标准输出(type:1标准输出，type:2标准错误输出)
        this.stdout = [];
        //最多保存多少条输出
        this.maxStdout = 10000; //默认最多保存10000条
        //关闭服务超时
        this.closeTimeout = 1000 * 60;
        if ('number' === typeof config.maxStdout)
            this.maxStdout = config.maxStdout;
        if ('number' === typeof config.closeTimeout)
            this.closeTimeout = config.closeTimeout;
    }
    /**
     * 启动服务
     *
     * @memberof ServiceContainer
     */
    async start() {
        if (this.runningState === 3 /* closed */) {
            //标记为已启动
            this.runningState = 0 /* starting */;
            this.emit('runningStateChange', 0 /* starting */);
            //清理上次执行
            this.errors.length = 0;
            this.stdout.length = 0;
            this.resourceUsage = undefined;
            //创建远端环境
            this.controller = await this.onCreateEnvironment();
            //网络连接异常
            this.controller.onConnectionError = (err) => {
                this.errors.push(err);
                this.emit('error', err);
                this.forceClose(); //强制关闭
            };
            //远端服务发生错误
            this.controller.onRemoteServiceError = (err) => {
                this.errors.push(err);
                this.emit('error', err);
            };
            //远端标准错误输出
            this.controller.onRemoteStderr = (timestamp, content) => {
                const out = { type: 2, timestamp, content };
                this.stdout.push(out);
                if (this.stdout.length > this.maxStdout)
                    this.stdout.shift();
                this.emit('stdout', out);
            };
            //远端标准输出
            this.controller.onRemoteStdout = (timestamp, content) => {
                const out = { type: 1, timestamp, content };
                this.stdout.push(out);
                if (this.stdout.length > this.maxStdout)
                    this.stdout.shift();
                this.emit('stdout', out);
            };
            //远端运行状态发生改变
            this.controller.onRunningStateChange = (state) => {
                this.runningState = state;
                this.emit('runningStateChange', state);
                if (state === 3 /* closed */) {
                    clearTimeout(this.close_time_out);
                    this.onDestroyEnvironment();
                }
            };
            //更新远端资源消耗
            this.controller.onUpdateResourceUsage = (usage) => {
                this.resourceUsage = usage;
                this.emit('updateResourceUsage', usage);
            };
        }
    }
    /**
     * 关闭服务
     *
     * @memberof ServiceContainer
     */
    close() {
        if (this.runningState !== 3 /* closed */) {
            this.controller.closeService();
            this.close_time_out = setTimeout(() => {
                this.forceClose();
            }, this.closeTimeout);
        }
    }
    /**
     * 强行关闭服务
     *
     * @memberof ServiceContainer
     */
    async forceClose() {
        if (this.runningState !== 3 /* closed */) {
            this.runningState = 3 /* closed */;
            clearTimeout(this.close_time_out);
            await this.onDestroyEnvironment();
            this.emit('runningStateChange', 3 /* closed */);
        }
    }
}
exports.default = ServiceContainer;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQztRQUNOLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUs7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLGNBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN0QixDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFCLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxVQUFVO1FBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxjQUFtQixDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsWUFBWSxHQUFHLGNBQW1CLENBQUM7WUFDeEMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNsQyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsY0FBbUIsQ0FBQyxDQUFDO1FBQ3pELENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJTZXJ2aWNlQ29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy/mnI3liqHlrrnlmahcclxuXHJcbmltcG9ydCBTZXJ2aWNlQ29udHJvbGxlciBmcm9tICcuL1NlcnZpY2VDb250cm9sbGVyJztcclxuaW1wb3J0IFJ1bm5pbmdTdGF0ZSBmcm9tICcuL1Rvb2xzL1J1bm5pbmdTdGF0ZSc7XHJcbmltcG9ydCBSZXNvdXJjZVVzYWdlSW5mb3JtYXRpb24gZnJvbSBcIi4vVG9vbHMvUmVzb3VyY2VVc2FnZUluZm9ybWF0aW9uXCI7XHJcbmltcG9ydCBTaW1wbGVFdmVudEVtaXRlciBmcm9tICcuL1Rvb2xzL1NpbXBsZUV2ZW50RW1pdGVyJztcclxuXHJcbi8qXHJcbuWMheWQq+eahOS6i+S7tlxyXG4gICAgLy/mnI3liqHlj5HnlJ/plJnor69cclxuICAgIGVycm9yOiAoZXJyOiBFcnJvcikgPT4gdm9pZDtcclxuICAgIC8v6L+c56uv5Y+R5p2l55qE5qCH5YeG6L6T5Ye6XHJcbiAgICBzdGRvdXQ6IChvdXQ6IHsgdHlwZTogbnVtYmVyLCB0aW1lc3RhbXA6IG51bWJlciwgY29udGVudDogc3RyaW5nIH0pID0+IHZvaWQ7XHJcbiAgICAvL+i/nOerr+acjeWKoei/kOihjOeKtuaAgeWPkeeUn+aUueWPmFxyXG4gICAgcnVubmluZ1N0YXRlQ2hhbmdlOiAoc3RhdGU6IFJ1bm5pbmdTdGF0ZSkgPT4gdm9pZDtcclxuICAgIC8v5pu05paw6L+c56uv6LWE5rqQ5raI6ICX5oOF5Ya1XHJcbiAgICB1cGRhdGVSZXNvdXJjZVVzYWdlOiAodXNhZ2U6IFJlc291cmNlVXNhZ2VJbmZvcm1hdGlvbikgPT4gdm9pZDtcclxuKi9cclxuXHJcbmFic3RyYWN0IGNsYXNzIFNlcnZpY2VDb250YWluZXIgZXh0ZW5kcyBTaW1wbGVFdmVudEVtaXRlciB7XHJcbiAgICAvL+acjeWKoeaOp+WItuWZqFxyXG4gICAgcHJpdmF0ZSBjb250cm9sbGVyOiBTZXJ2aWNlQ29udHJvbGxlcjtcclxuICAgIC8v5YWz6Zet6LaF5pe26K6h5pe25ZmoXHJcbiAgICBwcml2YXRlIGNsb3NlX3RpbWVfb3V0OiBOb2RlSlMuVGltZXI7XHJcblxyXG4gICAgLy/mnI3liqHov5DooYznirbmgIFcclxuICAgIHJ1bm5pbmdTdGF0ZTogUnVubmluZ1N0YXRlID0gUnVubmluZ1N0YXRlLmNsb3NlZDtcclxuICAgIC8v5pyN5Yqh6L+Q6KGM6ZSZ6K+vXHJcbiAgICBlcnJvcnM6IEVycm9yW10gPSBbXTtcclxuICAgIC8v5pyN5Yqh5qCH5YeG6L6T5Ye6KHR5cGU6Meagh+WHhui+k+WHuu+8jHR5cGU6Muagh+WHhumUmeivr+i+k+WHuilcclxuICAgIHN0ZG91dDogeyB0eXBlOiBudW1iZXIsIHRpbWVzdGFtcDogbnVtYmVyLCBjb250ZW50OiBzdHJpbmcgfVtdID0gW107XHJcbiAgICAvL+acgOWkmuS/neWtmOWkmuWwkeadoei+k+WHulxyXG4gICAgbWF4U3Rkb3V0ID0gMTAwMDA7ICAvL+m7mOiupOacgOWkmuS/neWtmDEwMDAw5p2hXHJcbiAgICAvL+WFs+mXreacjeWKoei2heaXtlxyXG4gICAgY2xvc2VUaW1lb3V0ID0gMTAwMCAqIDYwO1xyXG4gICAgLy/otYTmupDmtojogJfmg4XlhrVcclxuICAgIHJlc291cmNlVXNhZ2U6IFJlc291cmNlVXNhZ2VJbmZvcm1hdGlvbjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZywgICAgICAgLy/mnI3liqHlkI3np7BcclxuICAgICAgICByZWFkb25seSBzZXJ2aWNlQ29kZTogc3RyaW5nLCAgICAgICAvL+acjeWKoeS7o+eggVxyXG4gICAgICAgIHJlYWRvbmx5IGltcG9ydFNlcnZpY2VzOiBzdHJpbmdbXSwgIC8v5pyN5Yqh5L6d6LWW55qE5YW25LuW5pyN5YqhXHJcbiAgICAgICAgY29uZmlnOiBhbnkgLy/phY3nva7mnI3liqHlrrnlmajnmoTlj4LmlbBcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgY29uZmlnLm1heFN0ZG91dClcclxuICAgICAgICAgICAgdGhpcy5tYXhTdGRvdXQgPSBjb25maWcubWF4U3Rkb3V0O1xyXG5cclxuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBjb25maWcuY2xvc2VUaW1lb3V0KVxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlVGltZW91dCA9IGNvbmZpZy5jbG9zZVRpbWVvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rmnI3liqHnmoTmiafooYznjq/looPvvIzorrDlvpfmiormnI3liqHlkI3np7DjgIHmnI3liqHkvp3otZbliJfooajlj5Hov4fljrtcclxuICAgICAqIFxyXG4gICAgICogQGFic3RyYWN0XHJcbiAgICAgKiBAcmV0dXJucyB7U2VydmljZUNvbnRyb2xsZXJ9IFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyb2YgU2VydmljZUNvbnRhaW5lclxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgb25DcmVhdGVFbnZpcm9ubWVudCgpOiBQcm9taXNlPFNlcnZpY2VDb250cm9sbGVyPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgeacjeWKoeeOr+Wig1xyXG4gICAgICogXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKiBAYWJzdHJhY3RcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZpY2VDb250YWluZXJcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIG9uRGVzdHJveUVudmlyb25tZW50KCk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlkK/liqjmnI3liqFcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZpY2VDb250YWluZXJcclxuICAgICAqL1xyXG4gICAgYXN5bmMgc3RhcnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucnVubmluZ1N0YXRlID09PSBSdW5uaW5nU3RhdGUuY2xvc2VkKSB7XHJcbiAgICAgICAgICAgIC8v5qCH6K6w5Li65bey5ZCv5YqoXHJcbiAgICAgICAgICAgIHRoaXMucnVubmluZ1N0YXRlID0gUnVubmluZ1N0YXRlLnN0YXJ0aW5nO1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3J1bm5pbmdTdGF0ZUNoYW5nZScsIFJ1bm5pbmdTdGF0ZS5zdGFydGluZyk7XHJcblxyXG4gICAgICAgICAgICAvL+a4heeQhuS4iuasoeaJp+ihjFxyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnN0ZG91dC5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlVXNhZ2UgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAvL+WIm+W7uui/nOerr+eOr+Wig1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBhd2FpdCB0aGlzLm9uQ3JlYXRlRW52aXJvbm1lbnQoKTtcclxuXHJcbiAgICAgICAgICAgIC8v572R57uc6L+e5o6l5byC5bi4XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5vbkNvbm5lY3Rpb25FcnJvciA9IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JjZUNsb3NlKCk7ICAgLy/lvLrliLblhbPpl61cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8v6L+c56uv5pyN5Yqh5Y+R55Sf6ZSZ6K+vXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5vblJlbW90ZVNlcnZpY2VFcnJvciA9IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy/ov5znq6/moIflh4bplJnor6/ovpPlh7pcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLm9uUmVtb3RlU3RkZXJyID0gKHRpbWVzdGFtcCwgY29udGVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ID0geyB0eXBlOiAyLCB0aW1lc3RhbXAsIGNvbnRlbnQgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Rkb3V0LnB1c2gob3V0KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0ZG91dC5sZW5ndGggPiB0aGlzLm1heFN0ZG91dClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZG91dC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdzdGRvdXQnLCBvdXQpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy/ov5znq6/moIflh4bovpPlh7pcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLm9uUmVtb3RlU3Rkb3V0ID0gKHRpbWVzdGFtcCwgY29udGVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ID0geyB0eXBlOiAxLCB0aW1lc3RhbXAsIGNvbnRlbnQgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Rkb3V0LnB1c2gob3V0KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0ZG91dC5sZW5ndGggPiB0aGlzLm1heFN0ZG91dClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZG91dC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdzdGRvdXQnLCBvdXQpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy/ov5znq6/ov5DooYznirbmgIHlj5HnlJ/mlLnlj5hcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLm9uUnVubmluZ1N0YXRlQ2hhbmdlID0gKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bm5pbmdTdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdydW5uaW5nU3RhdGVDaGFuZ2UnLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09IFJ1bm5pbmdTdGF0ZS5jbG9zZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jbG9zZV90aW1lX291dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRlc3Ryb3lFbnZpcm9ubWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy/mm7TmlrDov5znq6/otYTmupDmtojogJdcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLm9uVXBkYXRlUmVzb3VyY2VVc2FnZSA9ICh1c2FnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZVVzYWdlID0gdXNhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3VwZGF0ZVJlc291cmNlVXNhZ2UnLCB1c2FnZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5pyN5YqhXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2aWNlQ29udGFpbmVyXHJcbiAgICAgKi9cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJ1bm5pbmdTdGF0ZSAhPT0gUnVubmluZ1N0YXRlLmNsb3NlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2xvc2VTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VfdGltZV9vdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9yY2VDbG9zZSgpO1xyXG4gICAgICAgICAgICB9LCB0aGlzLmNsb3NlVGltZW91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5by66KGM5YWz6Zet5pyN5YqhXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2aWNlQ29udGFpbmVyXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZvcmNlQ2xvc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucnVubmluZ1N0YXRlICE9PSBSdW5uaW5nU3RhdGUuY2xvc2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucnVubmluZ1N0YXRlID0gUnVubmluZ1N0YXRlLmNsb3NlZDtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xvc2VfdGltZV9vdXQpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLm9uRGVzdHJveUVudmlyb25tZW50KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncnVubmluZ1N0YXRlQ2hhbmdlJywgUnVubmluZ1N0YXRlLmNsb3NlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlQ29udGFpbmVyOyJdfQ==
