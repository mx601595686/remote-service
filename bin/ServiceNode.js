//对ServiceContainer的封装，简化启动关闭容器操作
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceNode {
    constructor(serviceContainer) {
        this.serviceContainer = serviceContainer;
        //服务完全关闭回调列表
        this.onClosedCallbackList = [];
        //服务完全启动回调列表
        this.onRunningCallbackList = [];
        //导入的服务,由ServiceManager来设置
        this.imports = [];
        //其他依赖该服务的服务,由ServiceManager来设置
        this.dependence = [];
        //调用回调列表
        serviceContainer.on('runningStateChange', (state) => {
            switch (state) {
                case 1 /* running */: {
                    this.onRunningCallbackList.forEach(item => item());
                    this.onRunningCallbackList.length = 0;
                    break;
                }
                case 3 /* closed */: {
                    this.onClosedCallbackList.forEach(item => item());
                    this.onClosedCallbackList.length = 0;
                    //关闭后还要再检查一下所有依赖了该服务的服务是否关闭了（这样做是为了针对服务崩溃的情况）
                    this.dependence.forEach(node => node.close());
                    break;
                }
            }
        });
    }
    /**
     * 关闭服务容器
     *
     * @returns {Promise<void>}
     *
     * @memberof ServiceNode
     */
    async close() {
        //在关闭之前检查是否所有的子服务都已经被关闭了
        for (let node of this.dependence) {
            await node.close();
        }
        return new Promise((resolve) => {
            if (this.serviceContainer.runningState !== 3 /* closed */) {
                this.onClosedCallbackList.push(resolve);
                this.serviceContainer.close();
            }
            else {
                resolve();
            }
        });
    }
    /**
     * 启动服务容器
     *
     * @returns {Promise<void>}
     *
     * @memberof ServiceNode
     */
    start() {
        return new Promise((resolve, reject) => {
            //检查是否所有依赖服务都已经启动了
            const isStart = this.imports.some(node => {
                const notRunning = node.serviceContainer.runningState !== 1 /* running */;
                if (notRunning)
                    reject(new Error(`Service '$ {this.serviceContainer.serviceName}' depended on service '$ {node.serviceContainer.serviceName}' has not been started`));
                return notRunning;
            });
            if (isStart) {
                if (this.serviceContainer.runningState === 3 /* closed */) {
                    this.onRunningCallbackList.push(resolve);
                    this.serviceContainer.start();
                }
                else {
                    resolve();
                }
            }
        });
    }
}
exports.default = ServiceNode;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2xDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXBGRCw4QkFvRkMiLCJmaWxlIjoiU2VydmljZU5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL+WvuVNlcnZpY2VDb250YWluZXLnmoTlsIHoo4XvvIznroDljJblkK/liqjlhbPpl63lrrnlmajmk43kvZxcclxuXHJcbmltcG9ydCBTZXJ2aWNlQ29udGFpbmVyIGZyb20gJy4vU2VydmljZUNvbnRhaW5lcic7XHJcbmltcG9ydCBTZXJ2aWNlTWFuYWdlciBmcm9tICcuL1NlcnZpY2VNYW5hZ2VyJztcclxuaW1wb3J0IFJ1bm5pbmdTdGF0ZSBmcm9tICcuL1Rvb2xzL1J1bm5pbmdTdGF0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlTm9kZSB7XHJcbiAgICAvL+acjeWKoeWujOWFqOWFs+mXreWbnuiwg+WIl+ihqFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBvbkNsb3NlZENhbGxiYWNrTGlzdDogRnVuY3Rpb25bXSA9IFtdO1xyXG4gICAgLy/mnI3liqHlrozlhajlkK/liqjlm57osIPliJfooahcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgb25SdW5uaW5nQ2FsbGJhY2tMaXN0OiBGdW5jdGlvbltdID0gW107XHJcblxyXG4gICAgLy/lr7zlhaXnmoTmnI3liqEs55SxU2VydmljZU1hbmFnZXLmnaXorr7nva5cclxuICAgIHJlYWRvbmx5IGltcG9ydHM6IFNlcnZpY2VOb2RlW10gPSBbXTtcclxuICAgIC8v5YW25LuW5L6d6LWW6K+l5pyN5Yqh55qE5pyN5YqhLOeUsVNlcnZpY2VNYW5hZ2Vy5p2l6K6+572uXHJcbiAgICByZWFkb25seSBkZXBlbmRlbmNlOiBTZXJ2aWNlTm9kZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcmVhZG9ubHkgc2VydmljZUNvbnRhaW5lcjogU2VydmljZUNvbnRhaW5lclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy/osIPnlKjlm57osIPliJfooahcclxuICAgICAgICBzZXJ2aWNlQ29udGFpbmVyLm9uKCdydW5uaW5nU3RhdGVDaGFuZ2UnLCAoc3RhdGU6IFJ1bm5pbmdTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1bm5pbmdTdGF0ZS5ydW5uaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJ1bm5pbmdDYWxsYmFja0xpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJ1bm5pbmdDYWxsYmFja0xpc3QubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgUnVubmluZ1N0YXRlLmNsb3NlZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZWRDYWxsYmFja0xpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlZENhbGxiYWNrTGlzdC5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+WFs+mXreWQjui/mOimgeWGjeajgOafpeS4gOS4i+aJgOacieS+nei1luS6huivpeacjeWKoeeahOacjeWKoeaYr+WQpuWFs+mXreS6hu+8iOi/meagt+WBmuaYr+S4uuS6humSiOWvueacjeWKoeW0qea6g+eahOaDheWGte+8iVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jZS5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbG9zZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5pyN5Yqh5a655ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZpY2VOb2RlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIC8v5Zyo5YWz6Zet5LmL5YmN5qOA5p+l5piv5ZCm5omA5pyJ55qE5a2Q5pyN5Yqh6YO95bey57uP6KKr5YWz6Zet5LqGXHJcbiAgICAgICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLmRlcGVuZGVuY2UpIHtcclxuICAgICAgICAgICAgYXdhaXQgbm9kZS5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlcnZpY2VDb250YWluZXIucnVubmluZ1N0YXRlICE9PSBSdW5uaW5nU3RhdGUuY2xvc2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2VkQ2FsbGJhY2tMaXN0LnB1c2gocmVzb2x2ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VDb250YWluZXIuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ZCv5Yqo5pyN5Yqh5a655ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZpY2VOb2RlXHJcbiAgICAgKi9cclxuICAgIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIC8v5qOA5p+l5piv5ZCm5omA5pyJ5L6d6LWW5pyN5Yqh6YO95bey57uP5ZCv5Yqo5LqGXHJcbiAgICAgICAgICAgIGNvbnN0IGlzU3RhcnQgPSB0aGlzLmltcG9ydHMuc29tZShub2RlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vdFJ1bm5pbmcgPSBub2RlLnNlcnZpY2VDb250YWluZXIucnVubmluZ1N0YXRlICE9PSBSdW5uaW5nU3RhdGUucnVubmluZztcclxuICAgICAgICAgICAgICAgIGlmIChub3RSdW5uaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYFNlcnZpY2UgJyQge3RoaXMuc2VydmljZUNvbnRhaW5lci5zZXJ2aWNlTmFtZX0nIGRlcGVuZGVkIG9uIHNlcnZpY2UgJyQge25vZGUuc2VydmljZUNvbnRhaW5lci5zZXJ2aWNlTmFtZX0nIGhhcyBub3QgYmVlbiBzdGFydGVkYCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdFJ1bm5pbmc7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlcnZpY2VDb250YWluZXIucnVubmluZ1N0YXRlID09PSBSdW5uaW5nU3RhdGUuY2xvc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJ1bm5pbmdDYWxsYmFja0xpc3QucHVzaChyZXNvbHZlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VDb250YWluZXIuc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
