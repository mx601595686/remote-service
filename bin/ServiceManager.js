//服务容器管理器
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceController_1 = require("./ServiceController");
const SimpleEventEmiter_1 = require("./Tools/SimpleEventEmiter");
const ServiceNode_1 = require("./ServiceNode");
/*
事件名：
create:(node)=>{}  一个新的服务容器被创建
start:(node)=>{}  一个节点被启动了
close:(node)=>{}  一个节点被关闭了
destroy:(node)=>{} 一个节点被销毁了
*/
class ServiceManager extends SimpleEventEmiter_1.default {
    constructor(containerList //容器列表
    ) {
        super();
        //容器列表
        this.containerList = {};
        //服务节点列表
        this.serviceTable = new Map();
        containerList.forEach(({ containerName, containerClass }) => {
            this.containerList[containerName] = containerClass;
        });
    }
    /**
     * 创建一个新的服务节点
     *
     * @param {string} containerName 服务容器的类型名称
     * @param {*} containerConfig 服务容器配置
     * @param {string} serviceName 要创建的服务名称
     * @param {string} serviceCode 服务代码
     * @param {string[]} importServices 服务依赖的服务名称
     * @returns {ServiceNode}
     *
     * @memberof ServiceManager
     */
    create(containerName, containerConfig, serviceName, serviceCode, importServices) {
        if (!(containerName in this.containerList)) {
            throw new Error(`do not has '${containerName}' container in container list`);
        }
        else if (this.serviceTable.has(serviceName)) {
            throw new Error(`service '${serviceName}' already exists`);
        }
        else if (serviceName === ServiceController_1.default.controllerName) {
            throw new Error(`service name can not be '${ServiceController_1.default.controllerName}'`);
        }
        else if (!importServices.every(name => this.serviceTable.has(name))) {
            const notCreated = importServices.find((name => !this.serviceTable.has(name)));
            throw new Error(`importing service '${notCreated}' has not been created`);
        }
        else {
            const container = new this.containerList[containerName](serviceName, serviceCode, importServices, containerConfig);
            const node = new ServiceNode_1.default(container);
            this.serviceTable.set(serviceName, node);
            //设置依赖的服务节点
            importServices.forEach(name => {
                const service = this.serviceTable.get(name);
                service.dependence.push(node);
                node.imports.push(service);
            });
            //监控容器状态变化
            node.serviceContainer.on('runningStateChange', (state) => {
                switch (state) {
                    case 1 /* running */: {
                        this.emit('start', this);
                        break;
                    }
                    case 3 /* closed */: {
                        this.emit('close', this);
                        break;
                    }
                }
            });
            this.emit('create', node);
            return node;
        }
    }
    /**
     * 启动服务
     *
     * @param {string} serviceName 要启动的服务名称
     *
     * @memberof ServiceManager
     */
    start(serviceName) {
        const node = this.serviceTable.get(serviceName);
        if (node !== undefined) {
            node.start();
        }
        else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }
    /**
     * 关闭服务
     *
     * @param {string} serviceName 要关闭的服务名称
     *
     * @memberof ServiceManager
     */
    close(serviceName) {
        const service = this.serviceTable.get(serviceName);
        if (service !== undefined) {
            service.close();
        }
        else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }
    /**
     * 销毁服务节点。
     * 注意如果该节点存在直接点，那子节点也会被销毁
     *
     * @param {string} serviceName 要销毁的服务名称
     *
     * @memberof ServiceManager
     */
    destroy(serviceName) {
        const service = this.serviceTable.get(serviceName);
        if (service !== undefined) {
            if (service.serviceContainer.runningState === 3 /* closed */) {
                //销毁依赖该服务的服务
                service.dependence.forEach(node => this.destroy(node.serviceContainer.serviceName));
                //移除该节点在其他服务中的依赖
                service.imports.forEach(node => {
                    const index = node.dependence.indexOf(service);
                    if (index !== -1)
                        node.dependence.splice(index, 1);
                });
                this.emit('destroy', service);
                this.serviceTable.delete(serviceName);
            }
            else {
                throw new Error(`service '${serviceName}' haven't been closed`); //确保服务在销毁前被关闭了
            }
        }
        else {
            throw new Error(`service '${serviceName}' haven't been created`);
        }
    }
}
exports.default = ServiceManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0osTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLFdBQVcsd0JBQXdCLENBQUMsQ0FBQztRQUNyRSxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBcklELGlDQXFJQyIsImZpbGUiOiJTZXJ2aWNlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8v5pyN5Yqh5a655Zmo566h55CG5ZmoXHJcblxyXG5pbXBvcnQgU2VydmljZUNvbnRhaW5lciBmcm9tICcuL1NlcnZpY2VDb250YWluZXInO1xyXG5pbXBvcnQgU2VydmljZUNvbnRyb2xsZXIgZnJvbSAnLi9TZXJ2aWNlQ29udHJvbGxlcic7XHJcbmltcG9ydCBSdW5uaW5nU3RhdGUgZnJvbSAnLi9Ub29scy9SdW5uaW5nU3RhdGUnO1xyXG5pbXBvcnQgU2ltcGxlRXZlbnRFbWl0ZXIgZnJvbSAnLi9Ub29scy9TaW1wbGVFdmVudEVtaXRlcic7XHJcbmltcG9ydCBTZXJ2aWNlTm9kZSBmcm9tIFwiLi9TZXJ2aWNlTm9kZVwiO1xyXG5cclxuLypcclxu5LqL5Lu25ZCN77yaXHJcbmNyZWF0ZToobm9kZSk9Pnt9ICDkuIDkuKrmlrDnmoTmnI3liqHlrrnlmajooqvliJvlu7pcclxuc3RhcnQ6KG5vZGUpPT57fSAg5LiA5Liq6IqC54K56KKr5ZCv5Yqo5LqGXHJcbmNsb3NlOihub2RlKT0+e30gIOS4gOS4quiKgueCueiiq+WFs+mXreS6hlxyXG5kZXN0cm95Oihub2RlKT0+e30g5LiA5Liq6IqC54K56KKr6ZSA5q+B5LqGXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2VNYW5hZ2VyIGV4dGVuZHMgU2ltcGxlRXZlbnRFbWl0ZXIge1xyXG4gICAgLy/lrrnlmajliJfooahcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyTGlzdDogYW55ID0ge307XHJcblxyXG4gICAgLy/mnI3liqHoioLngrnliJfooahcclxuICAgIHJlYWRvbmx5IHNlcnZpY2VUYWJsZSA9IG5ldyBNYXA8c3RyaW5nLCBTZXJ2aWNlTm9kZT4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBjb250YWluZXJMaXN0OiB7IGNvbnRhaW5lck5hbWU6IHN0cmluZywgY29udGFpbmVyQ2xhc3M6IHR5cGVvZiBTZXJ2aWNlQ29udGFpbmVyIH1bXSAvL+WuueWZqOWIl+ihqFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBjb250YWluZXJMaXN0LmZvckVhY2goKHsgY29udGFpbmVyTmFtZSwgY29udGFpbmVyQ2xhc3MgfSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckxpc3RbY29udGFpbmVyTmFtZV0gPSBjb250YWluZXJDbGFzcztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahOacjeWKoeiKgueCuVxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGFpbmVyTmFtZSDmnI3liqHlrrnlmajnmoTnsbvlnovlkI3np7BcclxuICAgICAqIEBwYXJhbSB7Kn0gY29udGFpbmVyQ29uZmlnIOacjeWKoeWuueWZqOmFjee9rlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VOYW1lIOimgeWIm+W7uueahOacjeWKoeWQjeensFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VDb2RlIOacjeWKoeS7o+eggVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0gaW1wb3J0U2VydmljZXMg5pyN5Yqh5L6d6LWW55qE5pyN5Yqh5ZCN56ewIFxyXG4gICAgICogQHJldHVybnMge1NlcnZpY2VOb2RlfSBcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZpY2VNYW5hZ2VyXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZShjb250YWluZXJOYW1lOiBzdHJpbmcsIGNvbnRhaW5lckNvbmZpZzogYW55LCBzZXJ2aWNlTmFtZTogc3RyaW5nLCBzZXJ2aWNlQ29kZTogc3RyaW5nLCBpbXBvcnRTZXJ2aWNlczogc3RyaW5nW10pOiBTZXJ2aWNlTm9kZSB7XHJcbiAgICAgICAgaWYgKCEoY29udGFpbmVyTmFtZSBpbiB0aGlzLmNvbnRhaW5lckxpc3QpKSB7ICAgLy/mo4Dmn6XlrrnlmajlkI3np7DmmK/lkKblrZjlnKhcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBkbyBub3QgaGFzICcke2NvbnRhaW5lck5hbWV9JyBjb250YWluZXIgaW4gY29udGFpbmVyIGxpc3RgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VydmljZVRhYmxlLmhhcyhzZXJ2aWNlTmFtZSkpIHsgICAvL+ajgOafpeacjeWKoeWQjeaYr+WQpuWtmOWcqFxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlcnZpY2UgJyR7c2VydmljZU5hbWV9JyBhbHJlYWR5IGV4aXN0c2ApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VydmljZU5hbWUgPT09IFNlcnZpY2VDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lKSB7ICAvL+ajgOafpeacjeWKoeWQjeaYr+WQpuS4jeetieS6jlNlcnZpY2VDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgc2VydmljZSBuYW1lIGNhbiBub3QgYmUgJyR7U2VydmljZUNvbnRyb2xsZXIuY29udHJvbGxlck5hbWV9J2ApXHJcbiAgICAgICAgfSBlbHNlIGlmICghaW1wb3J0U2VydmljZXMuZXZlcnkobmFtZSA9PiB0aGlzLnNlcnZpY2VUYWJsZS5oYXMobmFtZSkpKSB7IC8v56Gu5L+d5L6d6LWW55qE5pyN5Yqh6YO95bey57uP6KKr5Yib5bu65LqGXHJcbiAgICAgICAgICAgIGNvbnN0IG5vdENyZWF0ZWQgPSBpbXBvcnRTZXJ2aWNlcy5maW5kKChuYW1lID0+ICF0aGlzLnNlcnZpY2VUYWJsZS5oYXMobmFtZSkpKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbXBvcnRpbmcgc2VydmljZSAnJHtub3RDcmVhdGVkfScgaGFzIG5vdCBiZWVuIGNyZWF0ZWRgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBuZXcgdGhpcy5jb250YWluZXJMaXN0W2NvbnRhaW5lck5hbWVdKHNlcnZpY2VOYW1lLCBzZXJ2aWNlQ29kZSwgaW1wb3J0U2VydmljZXMsIGNvbnRhaW5lckNvbmZpZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgU2VydmljZU5vZGUoY29udGFpbmVyKTtcclxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlVGFibGUuc2V0KHNlcnZpY2VOYW1lLCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8v6K6+572u5L6d6LWW55qE5pyN5Yqh6IqC54K5XHJcbiAgICAgICAgICAgIGltcG9ydFNlcnZpY2VzLmZvckVhY2gobmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5zZXJ2aWNlVGFibGUuZ2V0KG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5kZXBlbmRlbmNlLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBub2RlLmltcG9ydHMucHVzaChzZXJ2aWNlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL+ebkeaOp+WuueWZqOeKtuaAgeWPmOWMllxyXG4gICAgICAgICAgICBub2RlLnNlcnZpY2VDb250YWluZXIub24oJ3J1bm5pbmdTdGF0ZUNoYW5nZScsIChzdGF0ZTogUnVubmluZ1N0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBSdW5uaW5nU3RhdGUucnVubmluZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3N0YXJ0JywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFJ1bm5pbmdTdGF0ZS5jbG9zZWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdjbG9zZScsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjcmVhdGUnLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ZCv5Yqo5pyN5YqhXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZXJ2aWNlTmFtZSDopoHlkK/liqjnmoTmnI3liqHlkI3np7BcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZpY2VNYW5hZ2VyXHJcbiAgICAgKi9cclxuICAgIHN0YXJ0KHNlcnZpY2VOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZXJ2aWNlVGFibGUuZ2V0KHNlcnZpY2VOYW1lKTtcclxuICAgICAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG5vZGUuc3RhcnQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlcnZpY2UgJyR7c2VydmljZU5hbWV9JyBoYXZlbid0IGJlZW4gY3JlYXRlZGApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFs+mXreacjeWKoVxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VydmljZU5hbWUg6KaB5YWz6Zet55qE5pyN5Yqh5ZCN56ewXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2aWNlTWFuYWdlclxyXG4gICAgICovXHJcbiAgICBjbG9zZShzZXJ2aWNlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IHRoaXMuc2VydmljZVRhYmxlLmdldChzZXJ2aWNlTmFtZSk7XHJcbiAgICAgICAgaWYgKHNlcnZpY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZXJ2aWNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZXJ2aWNlICcke3NlcnZpY2VOYW1lfScgaGF2ZW4ndCBiZWVuIGNyZWF0ZWRgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4HmnI3liqHoioLngrnjgIJcclxuICAgICAqIOazqOaEj+WmguaenOivpeiKgueCueWtmOWcqOebtOaOpeeCue+8jOmCo+WtkOiKgueCueS5n+S8muiiq+mUgOavgVxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VydmljZU5hbWUg6KaB6ZSA5q+B55qE5pyN5Yqh5ZCN56ewXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2aWNlTWFuYWdlclxyXG4gICAgICovXHJcbiAgICBkZXN0cm95KHNlcnZpY2VOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5zZXJ2aWNlVGFibGUuZ2V0KHNlcnZpY2VOYW1lKTtcclxuICAgICAgICBpZiAoc2VydmljZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChzZXJ2aWNlLnNlcnZpY2VDb250YWluZXIucnVubmluZ1N0YXRlID09PSBSdW5uaW5nU3RhdGUuY2xvc2VkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/plIDmr4Hkvp3otZbor6XmnI3liqHnmoTmnI3liqFcclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuZGVwZW5kZW5jZS5mb3JFYWNoKG5vZGUgPT4gdGhpcy5kZXN0cm95KG5vZGUuc2VydmljZUNvbnRhaW5lci5zZXJ2aWNlTmFtZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8v56e76Zmk6K+l6IqC54K55Zyo5YW25LuW5pyN5Yqh5Lit55qE5L6d6LWWXHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmltcG9ydHMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IG5vZGUuZGVwZW5kZW5jZS5pbmRleE9mKHNlcnZpY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVwZW5kZW5jZS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdkZXN0cm95Jywgc2VydmljZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VUYWJsZS5kZWxldGUoc2VydmljZU5hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZXJ2aWNlICcke3NlcnZpY2VOYW1lfScgaGF2ZW4ndCBiZWVuIGNsb3NlZGApOyAgICAvL+ehruS/neacjeWKoeWcqOmUgOavgeWJjeiiq+WFs+mXreS6hlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZXJ2aWNlICcke3NlcnZpY2VOYW1lfScgaGF2ZW4ndCBiZWVuIGNyZWF0ZWRgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19
